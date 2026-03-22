import React, { useState, useRef, useEffect } from 'react'
import "../auth.form.scss"
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/use.auth'

const Login = () => {
    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const canvasRef = useRef(null)
    const animationRef = useRef(null)
    const particlesRef = useRef([])
    const mouseRef = useRef({ x: null, y: null })

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        const PARTICLE_COUNT = 60
        const mouse = mouseRef.current

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        class Particle {
            constructor() { this.reset() }
            reset() {
                this.x = Math.random() * canvas.width
                this.y = Math.random() * canvas.height
                this.size = Math.random() * 2 + 1
                this.speedX = (Math.random() - 0.5) * 0.5
                this.speedY = (Math.random() - 0.5) * 0.5
                this.color = Math.random() > 0.8 ? '#ff2d75' : '#1e293b'
            }
            update() {
                this.x += this.speedX
                this.y += this.speedY
                if (mouse.x && mouse.y) {
                    const dx = mouse.x - this.x
                    const dy = mouse.y - this.y
                    const dist = Math.sqrt(dx * dx + dy * dy)
                    if (dist < 150) {
                        this.x -= dx * 0.01
                        this.y -= dy * 0.01
                    }
                }
                if (this.x < 0) this.x = canvas.width
                if (this.x > canvas.width) this.x = 0
                if (this.y < 0) this.y = canvas.height
                if (this.y > canvas.height) this.y = 0
            }
            draw() {
                ctx.fillStyle = this.color
                ctx.beginPath()
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
                ctx.fill()
            }
        }

        const connect = (particles) => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x
                    const dy = particles[i].y - particles[j].y
                    const dist = Math.sqrt(dx * dx + dy * dy)
                    if (dist < 150) {
                        ctx.strokeStyle = `rgba(56, 189, 248, ${0.1 * (1 - dist / 150)})`
                        ctx.lineWidth = 1
                        ctx.beginPath()
                        ctx.moveTo(particles[i].x, particles[i].y)
                        ctx.lineTo(particles[j].x, particles[j].y)
                        ctx.stroke()
                    }
                }
            }
        }

        const onMouseMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY }
        window.addEventListener('mousemove', onMouseMove)
        window.addEventListener('resize', resize)

        resize()
        particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => new Particle())

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            particlesRef.current.forEach(p => { p.update(); p.draw() })
            connect(particlesRef.current)
            animationRef.current = requestAnimationFrame(animate)
        }
        animate()

        return () => {
            cancelAnimationFrame(animationRef.current)
            window.removeEventListener('mousemove', onMouseMove)
            window.removeEventListener('resize', resize)
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        await handleLogin({ email, password })
        navigate('/home')
    }

    if (loading) {
        return (
            <main className="login-main">
                <canvas ref={canvasRef} className="background-canvas" />
                <div className="loading-text">Loading...</div>
            </main>
        )
    }

    return (
        <main className="login-main">
            <canvas ref={canvasRef} className="background-canvas" />

            <div className="login-container">
                <header className="login-header">
                    <h1>
                        Create Your Custom{' '}
                        <span className="brand-pink">Interview Plan</span>
                    </h1>
                    <p>Log in to access your AI-powered career strategy.</p>
                </header>

                <section className="glass-card">
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="you@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="input-group">
                            <div className="password-label-row">
                                <label htmlFor="password">Password</label>
                                <a href="#" className="forgot-link">Forgot password?</a>
                            </div>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="••••••••"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="login-btn">
                            <span>★</span>
                            <span>Login to Dashboard</span>
                        </button>
                    </form>

                    <footer className="card-footer">
                        <p>
                            Don't have an account?{' '}
                            <Link to="/register" className="register-link">Sign up for free</Link>
                        </p>
                    </footer>
                </section>

                <div className="footer-info">
                    AI-Powered Strategy Generation • Secured with 256-bit Encryption
                </div>
            </div>
        </main>
    )
}

export default Login