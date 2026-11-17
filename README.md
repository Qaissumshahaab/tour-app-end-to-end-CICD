# Shimaal Tours & Treks

> A responsive travel website for exploring Northern Pakistan, with an automated CI/CD path from a GitHub commit to a Kubernetes deployment.

This repository brings together the React app, GitHub Actions checks, a container build, Kubernetes manifests, and Argo CD configuration. The pipeline checks changes before they are released; a successful push to `main` publishes the container image to GitHub Container Registry (GHCR), and Argo CD keeps the cluster aligned with the manifests in this repository.

## At a glance

- **Website:** Home, destinations, tour packages, gallery, and booking inquiry pages.
- **Frontend:** React, Vite, React Router, Tailwind CSS, and Framer Motion.
- **CI:** GitHub Actions runs code-quality checks, tests, builds, and security scans.
- **Container:** Multi-stage Docker build; Nginx serves the static site as a non-root user on port `8080`.
- **Deployment:** Kubernetes on a three-node Kind cluster, managed from Git with Argo CD.
- **Image publishing:** Successful pushes to `main` publish commit-SHA and `latest` tags to GHCR.

## How the CI/CD automation works

The workflow is split into **validation**, **image publishing**, and **deployment reconciliation**. Pull requests and branch pushes validate the app; only a push to `main` publishes an image. Argo CD then watches the `main` branch's Kubernetes manifests and applies changes to the cluster.

### Branch and pull request behavior

| Event | What happens |
| --- | --- |
| Pull request targeting `main` | Runs the validation and scan jobs. It does not publish an image. |
| Push to `test` | Runs validation. If it succeeds, the auto-PR workflow opens (or reuses) a pull request from `test` to `main`. |
| Push to `main` | Runs validation, builds and scans the image, then publishes it to GHCR as both the commit SHA and `latest`. |
| Argo CD sync | Watches `main` at `k8s/manifests`; automated sync applies the desired state and self-heals drift. |

The auto-PR workflow runs after a successful **push** CI run on `test`; it does not merge the pull request. Review and merge remain a human decision. GitHub requires a `workflow_run` workflow to exist on the repository's default branch for that trigger to run.

### Checks and scans

The `Application CI` workflow performs these checks before publishing:

| Check | Why it runs |
| --- | --- |
| Gitleaks | Detects secrets committed to the repository. |
| Trivy filesystem scan (`vuln`, `secret`, `misconfig`) | Checks repository files for vulnerabilities, secrets, and configuration issues. High and critical findings with available fixes fail the workflow. |
| `npm audit --audit-level=high` | Fails on high-severity or higher npm dependency advisories. |
| Oxlint | Checks the application code and React rules. |
| Vitest | Runs the project's automated tests. |
| Vite production build | Confirms the frontend can be built for release. |
| SonarQube Cloud | Adds static analysis of `src` using `sonar-project.properties`. |
| Trivy image scan (`vuln`, `secret`) | Scans the built container before it is published; high and critical findings with available fixes fail the workflow. |

The workflow also uses npm caching and cancels older runs for the same branch or pull request when a newer commit arrives.

### Image release and update path

On a successful push to `main`, CI logs in to GHCR with the workflow token and publishes:

```text
ghcr.io/qaissumshahaab/tour-app-end-to-end-cicd:<commit-sha>
ghcr.io/qaissumshahaab/tour-app-end-to-end-cicd:latest
```

The repository name is lowercased for the image reference. CI also captures and reports the registry digest, which identifies the exact image content.

`ArgoCD/image-updater.yaml` configures Argo CD Image Updater to watch the `my-app` application and the GHCR image, using the `digest` update strategy. Its `argocd` write-back method updates the Argo CD application rather than committing a change to Git. The comments in that file explain the choice: because application source and deployment manifests share this repository, a bot-generated Git commit could trigger CI again. This file configures the updater resource; it does **not** install the Image Updater controller or its CRD. Those must be installed in the cluster first, and the controller must be able to read the image from GHCR.

## Deploying with Kind and Argo CD

### Prerequisites

- Docker, `kind`, and `kubectl`
- A successful `main` CI run that has published the app image to GHCR
- Argo CD installed in the cluster
- Argo CD Image Updater and its CRD installed if you want the image-updater resource to be active
- GHCR credentials configured in the cluster if the package is private

### Create the local cluster

From the repository root:

```sh
kind create cluster --name northern-tours --config k8s/kind-config.yaml
kubectl cluster-info --context kind-northern-tours
```

The Kind config creates one control-plane node and two worker nodes. Argo CD itself is an installation prerequisite, not installed by the files in this repository.

### Register the application with Argo CD

Once Argo CD is installed and `kubectl` is pointed at the Kind cluster, apply the project and application:

```sh
kubectl apply -f ArgoCD/app-project.yaml
kubectl apply -f ArgoCD/application.yaml
```

Apply the image updater resource after its CRD/controller has been installed:

```sh
kubectl apply -f ArgoCD/image-updater.yaml
```

The `cicd-tour-app-argocd` AppProject limits the source repository and destination namespace. The `my-app` Application reads `k8s/manifests` from the `main` branch and deploys to the cluster's `default` namespace. Automated sync is enabled with pruning and self-healing, so Argo CD removes resources deleted from Git and corrects live drift.

The Kustomize entry point at `k8s/manifests/kustomization.yaml` includes the Deployment, Service, and Ingress. The Deployment requests two replicas and applies container hardening: non-root execution, a read-only root filesystem, dropped Linux capabilities, no privilege escalation, and temporary writable volumes for Nginx.

### Open the app with port forwarding

The app listens on port `8080` in each pod. Its ClusterIP Service exposes port `3002` and forwards traffic to the pod's `8080`. To reach that Service from your computer:

```sh
kubectl -n default port-forward svc/tour-app-service 3002:3002
```

Keep that command running and open [http://localhost:3002](http://localhost:3002). `kubectl port-forward` creates a temporary local tunnel to the Kubernetes Service; it does not change the Service to a public or host port. Stop the tunnel with **Ctrl+C**.

### Open the Argo CD UI

Forward the Argo CD server's HTTPS service port to a local port:

```sh
kubectl -n argocd port-forward svc/argocd-server 8080:443
```

Keep the command running and visit [https://localhost:8080](https://localhost:8080). With the standard initial Argo CD installation, sign in as `admin` and retrieve the initial password from the `argocd-initial-admin-secret` Secret in the `argocd` namespace. Replace the initial password according to your cluster's security policy.

### Ingress and Kind networking

The Ingress manifest declares the NGINX ingress class and the host `3.106.182.152.nip.io`. The checked-in Kind config does not define `extraPortMappings`, and the repository does not install an ingress controller. Therefore, those files alone do not make that Ingress reachable from your machine on ports 80 or 443. To use Ingress locally, install a compatible ingress controller and configure Kind host-port mappings and a hostname that resolves to your local ingress endpoint. For a simple local check, use the Service port-forward above.

## Run the app locally

Use Node.js 22 (the version used in CI) and npm:

```sh
npm ci
npm run dev
```

Vite prints the local development URL. To run the same checks used by CI:

```sh
npm run lint
npm test
npm run build
```

## Project layout

| Path | Purpose |
| --- | --- |
| `src/pages/` | Route pages: home, destinations, packages, gallery, and contact. |
| `src/components/` | Shared navigation, footer, cards, logo, and motion/presentation components. |
| `src/components/interactive/` | Interactive road, route planner, cable car, and draggable gallery experiences. |
| `src/data/content.js` | Local destination, package, gallery, and testimonial content. |
| `src/hooks/usePerfMode.js` | Reduces visual effects for reduced-motion preferences, lower-powered devices, or constrained connections. |
| `src/test/` and `src/App.test.jsx` | Vitest setup and the app render smoke test. |
| `.github/workflows/` | CI checks, image publishing, and test-to-main pull request automation. |
| `ArgoCD/` | AppProject, Application, and Image Updater configuration. |
| `k8s/` | Kind cluster shape and Kubernetes Deployment, Service, Ingress, and Kustomize files. |
| `Dockerfile` | Multi-stage Vite build and unprivileged Nginx runtime image. |
| `vite.config.js`, `.oxlintrc.json` | Frontend build, test, and lint configuration. |
| `sonar-project.properties` | SonarQube Cloud project and source configuration. |
| `vercel.json` | Static-site build settings, SPA fallback, and asset caching headers for Vercel. |
| `public/` | Static public assets, including the favicon. |