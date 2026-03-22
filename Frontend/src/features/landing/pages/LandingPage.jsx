import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import '../styles/landing.scss';

const LandingPage = () => {
    const canvasRef = useRef(null);
    const animRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 60;
        const maxDistance = 150;

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }
        }

        function init() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particles = [];
            for (let i = 0; i < particleCount; i++) particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                const p1 = particles[i];
                p1.update();
                ctx.fillStyle = 'rgba(255, 75, 130, 0.35)';
                ctx.beginPath();
                ctx.arc(p1.x, p1.y, p1.size, 0, Math.PI * 2);
                ctx.fill();
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < maxDistance) {
                        ctx.strokeStyle = `rgba(75, 163, 255, ${0.12 * (1 - dist / maxDistance)})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }
            animRef.current = requestAnimationFrame(animate);
        }

        const handleResize = () => init();
        window.addEventListener('resize', handleResize);
        init();
        animate();

        return () => {
            cancelAnimationFrame(animRef.current);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="landing-page">
            <canvas ref={canvasRef} className="landing-canvas" />

            {/* Navigation */}
            <nav className="landing-nav">
                <div className="nav-inner">
                    <div className="nav-brand">
                        
                        <span className="brand-name">
                            <span className="brand-white">SkillGap Planner</span>
                            <span className="brand-pink"> AI</span>
                        </span>
                    </div>
                    <div className="nav-actions">
                        <button className="nav-login-btn" onClick={() => navigate('/login')}>Login</button>
                        <button className="nav-cta-btn" onClick={() => navigate('/register')}>Get Started</button>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <main className="landing-hero">
                <div className="hero-inner">
                    <div className="hero-badge">
                        <span className="badge-dot">●</span>
                        AI-Powered Interview Coach
                    </div>
                    <h1 className="hero-title">
                        Master Your Next <br />
                        <span className="hero-gradient">Interview with AI</span>
                    </h1>
                    <p className="hero-sub">
                        Upload your resume and the job description. Our AI analyzes skill gaps,
                        optimizes your profile, and generates tailored practice questions in seconds.
                    </p>
                    <div className="hero-actions">
                        <button className="hero-cta-btn" onClick={() => navigate('/register')}>
                            Get Started for Free
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                            </svg>
                        </button>
                    </div>

                    {/* Social Proof */}
                    <div className="social-proof">
                        <p className="proof-label">Join hundreds of candidates landing jobs at their dream company</p>
                        <div className="company-logos">
                            <span>GOOGLE</span>
                            <span>META</span>
                            <span>amazon</span>
                            <span>NETFLIX</span>
                            <span>STRIPE</span>
                        </div>
                    </div>
                </div>
            </main>

            {/* Features */}
            <section className="landing-features">
                <div className="features-inner">
                    <div className="features-header">
                        <h2>Powerful Features for Modern Job Seekers</h2>
                        <div className="header-line" />
                    </div>
                    <div className="features-grid">
                        {/* Feature 1 */}
                        <div className="feature-card" style={{ animationDelay: '0s' }}>
                            <div className="feature-icon pink-icon">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                </svg>
                            </div>
                            <h3>ATS-Optimized Resumes</h3>
                            <p>Our AI identifies keyword mismatches and formatting issues that get you filtered out by hiring software.</p>
                            <div className="feature-demo">
                                <div className="demo-row">
                                    <div className="demo-file">
                                        <svg fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                                        </svg>
                                    </div>
                                    <div className="demo-lines">
                                        <div className="demo-line" />
                                        <div className="demo-line short" />
                                    </div>
                                    <div className="demo-check">
                                        <svg fill="currentColor" viewBox="0 0 20 20">
                                            <path clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fillRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="feature-card" style={{ animationDelay: '1s' }}>
                            <div className="feature-icon blue-icon">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                    <path d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                </svg>
                            </div>
                            <h3>Skill Gap Detection</h3>
                            <p>Visualize exactly where you stand against the job requirements and get a roadmap to bridge the gap.</p>
                            <div className="skill-bars">
                                <div className="skill-row">
                                    <div className="skill-labels">
                                        <span>REACT &amp; TYPESCRIPT</span>
                                        <span>95%</span>
                                    </div>
                                    <div className="skill-track"><div className="skill-fill blue-fill" style={{ width: '95%' }} /></div>
                                </div>
                                <div className="skill-row">
                                    <div className="skill-labels">
                                        <span>SYSTEM DESIGN</span>
                                        <span>60%</span>
                                    </div>
                                    <div className="skill-track"><div className="skill-fill pink-fill" style={{ width: '60%' }} /></div>
                                </div>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="feature-card" style={{ animationDelay: '2s' }}>
                            <div className="feature-icon pink-icon">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                </svg>
                            </div>
                            <h3>AI Question Generator</h3>
                            <p>Get technical and behavioral questions specific to the company's interview style and culture.</p>
                            <div className="question-demo">
                                <div className="q-dot" />
                                <p>"Explain how you would optimize a React application with massive data lists?"</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="landing-cta">
                <div className="cta-glow" />
                <div className="cta-card">
                    <div className="cta-orb" />
                    <h2>Ready to Land Your <br />Dream Offer?</h2>
                    <p>Stop guessing what the interviewer wants. Use AI to prepare with precision and confidence.</p>
                    <div className="cta-actions">
                        <button className="cta-main-btn" onClick={() => navigate('/register')}>
                            Start Your Interview Prep
                        </button>
                        <div className="cta-note">
                            <svg fill="currentColor" viewBox="0 0 20 20">
                                <path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" />
                            </svg>
                            <span>No credit card required</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
