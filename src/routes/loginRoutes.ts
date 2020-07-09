import { Request, Response, NextFunction } from 'express' // eslint-disable-line no-unused-vars
import { AppRouter } from '../AppRouter'

interface RequestWithBody extends Request {
  body: { [key: string]: string | undefined }
}

function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (req.session && req.session.loggedIn) {
    next()
    return
  }

  res.status(403)
  res.send('Not permitted')
}

const router = AppRouter.getInstance()

router.post('/login', (req: RequestWithBody, res: Response) => {
  const { username, password } = req.body

  if (username === 'vincent' && password === 'password') {
    req.session = { loggedIn: true }
    res.redirect('/')
  } else {
    res.send('Invalid username or password')
  }
})

router.get('/', (req: Request, res: Response) => {
  if (req.session && req.session.loggedIn) {
    res.send(`
      <div>
        <div>You are logged in</div>
        <a href="/logout">Logout</a>
      </div>
    `)
  } else {
    res.send(`
      <div>
        <div>You are not logged in</div>
        <a href="/login">Login</a>
      </div>
    `)
  }
})

router.get('/logout', (req: Request, res: Response) => {
  // req.session = undefined
  res.redirect('/')
})

router.get('/protected', requireAuth, (req: Request, res: Response) => {
  res.send('Welcome to protected route, logged in user')
})

export { router }
