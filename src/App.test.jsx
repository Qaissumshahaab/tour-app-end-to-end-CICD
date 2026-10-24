import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

describe('App', () => {
it('renders the application without crashing', () => {
const { container } = render( <MemoryRouter> <App /> </MemoryRouter>
)


expect(container.firstChild).not.toBeNull()


})
})
