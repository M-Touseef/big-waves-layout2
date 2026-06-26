import React, { useState, useEffect, useRef } from "react"
import { GlobeBars } from "@/components/ui/cobe-globe-bars"
import { 
  Menu, 
  X, 
  CheckCircle2, 
  ExternalLink, 
  MapPin, 
  Mail, 
  Phone, 
  Anchor,
  Compass,
  ArrowUpRight
} from "lucide-react"

// --- SUBSIDIARY COMPANY DATA ---
interface Company {
  id: string
  name: string
  cat: string
  country: string
  lat: number
  lon: number
  url: string | null
  desc: string
  value: number
  image: string
}

const companies: Company[] = [
  {
    id: "bar-1",
    name: "Waterline",
    cat: "Maritime / Marine",
    country: "Egypt",
    lat: 26, lon: 30,
    url: "https://waterlineegypt.com",
    desc: "Pioneers maritime solutions across the Red Sea and Mediterranean, delivering vessel management and marine infrastructure services.",
    value: 88,
    image: "/maritime_bg_1782432276099.png"
  },
  {
    id: "bar-2",
    name: "My Network",
    cat: "Networking / Business",
    country: "Saudi Arabia",
    lat: 23, lon: 45,
    url: "https://mynetworkksa.com",
    desc: "Connects entrepreneurs and industry leaders across the Gulf region through curated business experiences and strategic partnerships.",
    value: 92,
    image: "/tech_bg_1782432289755.png"
  },
  {
    id: "bar-3",
    name: "QNet",
    cat: "Global Commerce",
    country: "International",
    lat: 10, lon: 77,
    url: null,
    desc: "A global commerce platform bridging markets and creating pathways for international trade and cultural exchange.",
    value: 75,
    image: "/tech_bg_1782432289755.png"
  },
  {
    id: "bar-4",
    name: "Stylies",
    cat: "Luxury Fashion",
    country: "Switzerland",
    lat: 47, lon: 8,
    url: null,
    desc: "Swiss-crafted luxury fashion bringing European elegance to global clientele with a focus on bespoke tailoring.",
    value: 80,
    image: "/luxury_bg_1782432467478.png"
  },
  {
    id: "bar-5",
    name: "Alpin Group",
    cat: "Yacht Parts",
    country: "Germany",
    lat: 51, lon: 10,
    url: null,
    desc: "German-engineered precision yacht components and marine accessories designed for the superyacht industry.",
    value: 85,
    image: "/maritime_bg_1782432276099.png"
  },
  {
    id: "bar-6",
    name: "WindsorPatania",
    cat: "Architecture",
    country: "UK / KSA / Italy",
    lat: 51.5, lon: -0.1,
    url: "https://windsorpatania.com",
    desc: "Internationally acclaimed architecture studio blending heritage-inspired design with contemporary urban vision.",
    value: 94,
    image: "/architecture_bg_1782432455552.png"
  },
  {
    id: "bar-7",
    name: "Chain Moray",
    cat: "Marine Consultancy",
    country: "Saudi Arabia",
    lat: 24, lon: 39,
    url: "https://chain-moray.com",
    desc: "Specializes in underwater surveys, hull inspections, and comprehensive maritime compliance across the Arabian Gulf.",
    value: 82,
    image: "/maritime_bg_1782432276099.png"
  }
]

// Convert companies to markers suitable for Cobe Globe
const globeMarkers = companies.map((c) => ({
  id: c.id,
  location: [c.lat, c.lon] as [number, number],
  value: c.value,
  label: c.name
}))

const heroSlides = [
  {
    title: "Where Vision|Meets the Deep",
    subtitle: "Navigating Global Horizons",
    bg: "/new_maritime_bg.png"
  },
  {
    title: "Bridging Global|Markets & Networks",
    subtitle: "Commerce & Synergy",
    bg: "/new_tech_bg.png"
  },
  {
    title: "Shaping Tomorrow's|Visionary Skylines",
    subtitle: "Architecture & Design",
    bg: "/new_architecture_bg.png"
  },
  {
    title: "Defining True|Uncompromising Elegance",
    subtitle: "Luxury & Craftsmanship",
    bg: "/new_luxury_bg.png"
  }
]

function App() {
  const [activeCompany, setActiveCompany] = useState<Company>(companies[0])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [navScrolled, setNavScrolled] = useState(false)
  const [preloaderFade, setPreloaderFade] = useState(false)
  const [preloaderHidden, setPreloaderHidden] = useState(false)
  const [popups, setPopups] = useState<Array<{id: number; top: string; right: string}>>([])
  // Generate a random popup every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now()
      const top = `${Math.floor(Math.random() * 80) + 10}%`
      const right = `${Math.floor(Math.random() * 80) + 10}%`
      setPopups((prev) => [...prev, { id, top, right }])
      // Auto-remove after 5s
      setTimeout(() => {
        setPopups((prev) => prev.filter((p) => p.id !== id))
      }, 5000)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const [heroIndex, setHeroIndex] = useState(0)

  // Form State
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Canvas Refs
  const heroCanvasRef = useRef<HTMLCanvasElement>(null)
  const dividerCanvasRef = useRef<HTMLCanvasElement>(null)

  // Hero Slide Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Preloader fadeout
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setPreloaderFade(true)
    }, 1200)

    const timer2 = setTimeout(() => {
      setPreloaderHidden(true)
    }, 2000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  // Header scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setNavScrolled(true)
      } else {
        setNavScrolled(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Hero Canvas Animation (Sinusoidal Bathymetry & Particles)
  useEffect(() => {
    const canvas = heroCanvasRef.current
    if (!canvas) return

    const hctx = canvas.getContext("2d")
    if (!hctx) return

    let animationId: number
    let hw = (canvas.width = window.innerWidth)
    let hh = (canvas.height = window.innerHeight)

    const handleResize = () => {
      hw = canvas.width = window.innerWidth
      hh = canvas.height = window.innerHeight
    }
    window.addEventListener("resize", handleResize)

    class GoldBubble {
      x!: number
      y!: number
      size!: number
      speed!: number
      alpha!: number

      constructor() {
        this.reset(true)
      }

      reset(init = false) {
        this.x = Math.random() * hw
        this.y = init ? Math.random() * hh : hh + 20
        this.size = Math.random() * 1 + 1 // 1px to 2px
        this.speed = Math.random() * 0.4 + 0.2 // 0.2px to 0.6px
        this.alpha = Math.random() * 0.35 + 0.25
      }

      update() {
        this.y -= this.speed
        this.x += Math.sin(this.y * 0.005) * 0.1
        if (this.y < -10) this.reset()
      }

      draw() {
        hctx!.beginPath()
        hctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        hctx!.fillStyle = `rgba(201, 168, 76, ${this.alpha})`
        hctx!.fill()
      }
    }

    const goldBubbles: GoldBubble[] = []
    for (let i = 0; i < 45; i++) {
      goldBubbles.push(new GoldBubble())
    }

    const waveLines = [
      { baseYRatio: 0.2, freq: 0.0015, amplitude: 15, speed: 0.004 },
      { baseYRatio: 0.28, freq: 0.0018, amplitude: 19, speed: 0.0045 },
      { baseYRatio: 0.36, freq: 0.0021, amplitude: 23, speed: 0.005 },
      { baseYRatio: 0.44, freq: 0.0024, amplitude: 27, speed: 0.0055 },
      { baseYRatio: 0.52, freq: 0.0027, amplitude: 31, speed: 0.006 },
      { baseYRatio: 0.6, freq: 0.003, amplitude: 35, speed: 0.0065 },
      { baseYRatio: 0.68, freq: 0.0033, amplitude: 39, speed: 0.007 },
      { baseYRatio: 0.76, freq: 0.0036, amplitude: 43, speed: 0.0075 }
    ]

    let time = 0
    function animate() {
      hctx!.clearRect(0, 0, hw, hh)

      // Draw waves
      waveLines.forEach((wave, idx) => {
        hctx!.beginPath()
        const yBase = wave.baseYRatio * hh
        hctx!.lineWidth = 0.6
        hctx!.strokeStyle = `rgba(26, 74, 107, ${0.12 - idx * 0.01})`

        for (let x = 0; x <= hw; x += 10) {
          const y = yBase + Math.sin(x * wave.freq + time * wave.speed) * wave.amplitude
          if (x === 0) hctx!.moveTo(x, y)
          else hctx!.lineTo(x, y)
        }
        hctx!.stroke()
      })

      // Update and draw bubbles
      goldBubbles.forEach((bubble) => {
        bubble.update()
        bubble.draw()
      })

      time += 0.8
      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  // Divider Canvas Animation (Waves only)
  useEffect(() => {
    const canvas = dividerCanvasRef.current
    if (!canvas) return

    const dctx = canvas.getContext("2d")
    if (!dctx) return

    let animationId: number
    let dw = (canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth)
    let dh = (canvas.height = canvas.parentElement?.offsetHeight || 400)

    const handleResize = () => {
      dw = canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth
      dh = canvas.height = canvas.parentElement?.offsetHeight || 400
    }
    window.addEventListener("resize", handleResize)

    const divLines = [
      { baseYRatio: 0.35, freq: 0.002, amplitude: 10, speed: 0.002 },
      { baseYRatio: 0.5, freq: 0.003, amplitude: 18, speed: 0.003 },
      { baseYRatio: 0.65, freq: 0.0015, amplitude: 12, speed: 0.0015 },
      { baseYRatio: 0.8, freq: 0.0025, amplitude: 15, speed: 0.0022 }
    ]

    let divTime = 0
    function animateDivider() {
      dctx!.clearRect(0, 0, dw, dh)
      dctx!.lineWidth = 0.5

      divLines.forEach((wave, idx) => {
        dctx!.beginPath()
        const yBase = wave.baseYRatio * dh
        dctx!.strokeStyle = `rgba(26, 74, 107, ${0.08 - idx * 0.015})`

        for (let x = 0; x <= dw; x += 10) {
          const y = yBase + Math.sin(x * wave.freq + divTime * wave.speed) * wave.amplitude
          if (x === 0) dctx!.moveTo(x, y)
          else dctx!.lineTo(x, y)
        }
        dctx!.stroke()
      })

      divTime += 0.5
      animationId = requestAnimationFrame(animateDivider)
    }
    animateDivider()

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  // Smooth scroll helper
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, selector: string) => {
    e.preventDefault()
    const target = document.querySelector(selector)
    if (target) {
      target.scrollIntoView({ behavior: "smooth" })
    }
    setDrawerOpen(false)
  }

  // Handle marker click on the Cobe globe
  const handleMarkerClick = (markerId: string) => {
    const matched = companies.find((c) => c.id === markerId)
    if (matched) {
      setActiveCompany(matched)
    }
  }
  // Show toast at a random position
  const showRandomToast = () => {
    const top = `${Math.floor(Math.random() * 70) + 10}%`
    const right = `${Math.floor(Math.random() * 70) + 10}%`
    setToastPos({ top, right })
    setShowToast(true)
  }

  // Contact form submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      alert("Please fill out all fields.")
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      showRandomToast()
      setFormData({ name: "", email: "", message: "" })
      setTimeout(() => {
        setShowToast(false)
      }, 4500)
    }, 1200)
  }

  return (
    <div className="relative min-h-screen bg-navy text-pearl selection:bg-gold/30 selection:text-gold">
      
      {/* ── PRELOADER ── */}
      {!preloaderHidden && (
        <div 
          id="preloader" 
          className={`fixed inset-0 bg-black z-50 flex flex-col justify-center items-center transition-opacity duration-700 ease-in-out ${
            preloaderFade ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <svg className="w-[260px] h-[60px] mb-6" viewBox="0 0 300 60">
            <path 
              className="stroke-gold fill-none stroke-[1.5] stroke-linecap-round"
              style={{
                strokeDasharray: 1000,
                strokeDashoffset: 1000,
                animation: "bar-fill 1.8s forwards ease-in-out",
                // @ts-expect-error custom css variable
                "--value": "0%"
              }}
              d="M10,30 Q55,5 100,30 T190,30 T280,30" 
            />
          </svg>
          <div className="font-montserrat font-medium text-pearl tracking-[0.35em] text-[11px]">
            {"BIG WAVE".split("").map((char, index) => (
              <span 
                key={index}
                className="inline-block animate-[fade-in_0.5s_forwards]"
                style={{ 
                  animationDelay: `${0.2 + index * 0.08}s`,
                  opacity: 0,
                  transform: "translateY(8px)"
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── STICKY TOP NAVIGATION ── */}
      <nav 
        id="main-nav" 
        className={`fixed top-0 left-0 w-full h-16 px-6 md:px-16 z-40 flex items-center justify-between transition-all duration-300 ${
          navScrolled ? "glass-nav" : "bg-transparent border-b border-transparent"
        }`}
      >
        <a 
          href="#hero" 
          onClick={(e) => scrollToSection(e, "#hero")} 
          className="flex items-center gap-2.5 font-montserrat font-semibold text-[13px] tracking-[0.3em] text-pearl text-decoration-none"
          aria-label="Big Wave Homepage"
        >
          <svg className="w-5 h-5 fill-none stroke-gold stroke-[1.5]" viewBox="0 0 30 30">
            <path d="M 5,20 C 10,12 13,12 17,20 C 21,28 24,14 28,18" strokeLinecap="round"/>
            <path d="M 2,24 C 7,16 10,16 14,24 C 18,32 21,18 25,22" strokeLinecap="round" opacity="0.4"/>
          </svg>
          <span>BIG WAVE</span>
        </a>
        
        {/* Desktop Links */}
        

        {/* Mobile Toggle */}
        <button 
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="md:hidden text-pearl hover:text-gold focus:outline-none"
          aria-label="Toggle Menu"
          aria-expanded={drawerOpen}
        >
          {drawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Full‑Screen Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-deep bg-gradient-to-b from-navy/80 via-navy/60 to-navy/40 backdrop-blur-xl z-50 flex flex-col items-center justify-center transition-opacity duration-500 ${
          drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <ul className="flex flex-col gap-8 list-none text-center">
          <li>
            <a 
              href="#portfolio" 
              onClick={(e) => { scrollToSection(e, "#portfolio"); setDrawerOpen(false); }}
              className="font-montserrat text-2xl font-light text-pearl hover:text-gold transition-colors"
            >Portfolio</a>
          </li>
          <li>
            <a 
              href="#about" 
              onClick={(e) => { scrollToSection(e, "#about"); setDrawerOpen(false); }}
              className="font-montserrat text-2xl font-light text-pearl hover:text-gold transition-colors"
            >About</a>
          </li>
          <li>
            <a 
              href="#contact" 
              onClick={(e) => { scrollToSection(e, "#contact"); setDrawerOpen(false); }}
              className="font-montserrat text-2xl font-light text-pearl hover:text-gold transition-colors"
            >Contact</a>
          </li>
        </ul>
      </div>

      {/* ── HERO SECTION ── */}
      <section 
        id="hero" 
        className="relative h-screen flex items-center justify-center overflow-hidden bg-navy"
      >
        {/* Crossfading Backgrounds */}
        {heroSlides.map((slide, idx) => (
          <div 
            key={`bg-${idx}`}
            className={`absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-[2000ms] ease-in-out ${
              idx === heroIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
            style={{ backgroundImage: `url('${slide.bg}')` }}
          />
        ))}

        {/* Stronger overlay for contrast */}
        <div className="absolute inset-0 bg-navy/60 z-0 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-navy/40 z-0 pointer-events-none" />

        <canvas ref={heroCanvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />

        <div className="relative text-center max-w-[800px] px-6 z-20 h-[400px] flex flex-col items-center justify-center">
          
          {/* Crossfading Text Content */}
          <div className="relative w-full h-[200px] flex items-center justify-center mb-6">
            {heroSlides.map((slide, idx) => {
              const parts = slide.title.split('|')
              return (
                <div 
                  key={`text-${idx}`}
                  className={`absolute w-full transition-all duration-1000 ease-in-out flex flex-col items-center ${
                    idx === heroIndex 
                      ? 'opacity-100 translate-y-0 pointer-events-auto' 
                      : 'opacity-0 translate-y-4 pointer-events-none'
                  }`}
                >
                  <span className="font-montserrat text-[9px] font-medium tracking-[0.28em] uppercase text-gold block mb-5">
                    {slide.subtitle}
                  </span>
                  <h1 className="font-cormorant font-light text-5xl md:text-7xl lg:text-8xl text-pearl leading-[0.95] tracking-tight">
                    {parts[0]}<br />
                    <span className="italic text-pearl/70">{parts[1]}</span>
                  </h1>
                </div>
              )
            })}
          </div>

          {/* Static Content */}
          <p className="font-montserrat font-light text-xs md:text-[13px] leading-[1.85] text-pearl-dim max-w-[480px] mx-auto mb-10">
            Big Wave Holding Company steers a portfolio of world-class ventures across maritime, commerce, architecture, and luxury — from Riyadh to the open sea.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <button 
              onClick={(e) => scrollToSection(e, "#portfolio")}
              className="font-montserrat text-[9px] font-medium tracking-[0.22em] uppercase py-3.5 px-8 border border-gold/35 rounded-[2px] bg-transparent text-pearl hover:bg-gold/8 hover:border-gold hover:text-gold cursor-pointer transition-all duration-300"
            >
              Explore Portfolio
            </button>
            <button 
              onClick={(e) => scrollToSection(e, "#about")}
              className="font-montserrat text-[9px] font-medium tracking-[0.22em] uppercase py-3.5 px-8 border border-pearl/12 rounded-[2px] bg-transparent text-pearl-dim hover:border-pearl/35 hover:text-pearl cursor-pointer transition-all duration-300"
            >
              Our Story ↓
            </button>
          </div>
        </div>
      </section>

      {/* ── ABOUT SECTION (Parallax & Glassmorphism) ── */}
      <section id="about" className="relative py-32 px-6 md:px-16 overflow-hidden">
        
        {/* Parallax Background */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-fixed z-0"
          style={{ backgroundImage: "url('/new_architecture_bg.png')" }}
        />
        <div className="absolute inset-0 bg-navy/80 mix-blend-multiply z-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy/50 to-navy z-0" />

        <div className="glass-panel w-full overflow-hidden py-4 mb-24 select-none absolute left-0 right-0 z-10" aria-hidden="true">
          <div className="flex gap-16 w-max animate-[autoScrollHorizontal_30s_linear_infinite] whitespace-nowrap">
            <span className="font-montserrat text-[10px] font-semibold tracking-[0.25em] uppercase text-gold/60">◆ Holding Company · Riyadh</span>
            <span className="font-montserrat text-[10px] font-semibold tracking-[0.25em] uppercase text-gold/60">◆ 7 Subsidiary Companies</span>
            <span className="font-montserrat text-[10px] font-semibold tracking-[0.25em] uppercase text-gold/60">◆ 6 Countries</span>
            <span className="font-montserrat text-[10px] font-semibold tracking-[0.25em] uppercase text-gold/60">◆ Maritime · Commerce · Architecture · Luxury</span>
            <span className="font-montserrat text-[10px] font-semibold tracking-[0.25em] uppercase text-gold/60">◆ Holding Company · Riyadh</span>
            <span className="font-montserrat text-[10px] font-semibold tracking-[0.25em] uppercase text-gold/60">◆ 7 Subsidiary Companies</span>
            <span className="font-montserrat text-[10px] font-semibold tracking-[0.25em] uppercase text-gold/60">◆ 6 Countries</span>
            <span className="font-montserrat text-[10px] font-semibold tracking-[0.25em] uppercase text-gold/60">◆ Maritime · Commerce · Architecture · Luxury</span>
          </div>
        </div>

        <div className="relative z-20 max-w-[1200px] mx-auto mt-24">
          {/* About Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            
            <div className="md:col-span-5 relative group">
              <div className="absolute -inset-4 bg-gold/5 blur-2xl group-hover:bg-gold/10 transition-all duration-700 rounded-full" />
              <div className="glass-panel p-10 lg:p-14 rounded-[2px] relative transform hover:-translate-y-2 transition-all duration-500 shadow-2xl">
                <span className="font-montserrat text-[10px] font-semibold tracking-[0.28em] uppercase text-gold block mb-6">
                  The Genesis
                </span>
                <h2 className="font-cormorant font-light text-4xl lg:text-5xl leading-tight text-pearl mb-8">
                  "Built on the depth of the ocean,<br />
                  <span className="italic text-pearl-dim/80">reaching the breadth of the world."</span>
                </h2>
                <div className="w-12 h-[1px] bg-gold/40 mb-8" />
                <div className="flex justify-between items-end border-t border-gold/10 pt-8 mt-4">
                  <div className="text-center">
                    <span className="font-cormorant font-light text-5xl text-gold block leading-none mb-2">7</span>
                    <span className="font-montserrat text-[7px] font-medium tracking-[0.25em] uppercase text-pearl-dim/60">Companies</span>
                  </div>
                  <div className="text-center">
                    <span className="font-cormorant font-light text-5xl text-gold block leading-none mb-2">6</span>
                    <span className="font-montserrat text-[7px] font-medium tracking-[0.25em] uppercase text-pearl-dim/60">Countries</span>
                  </div>
                  <div className="text-center">
                    <span className="font-cormorant font-light text-5xl text-gold block leading-none mb-2">4</span>
                    <span className="font-montserrat text-[7px] font-medium tracking-[0.25em] uppercase text-pearl-dim/60">Industries</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-7 font-montserrat font-light text-[14px] leading-[2.2] text-pearl-dim/90 pl-0 lg:pl-12">
              <p className="mb-6 first-letter:text-5xl first-letter:font-cormorant first-letter:text-gold first-letter:float-left first-letter:mr-3 first-letter:mt-[-8px]">
                Big Wave Holding Company was founded on the belief that the world's most impactful ventures share a single quality — they move with purpose, precision, and scale. We don't just invest; we navigate.
              </p>
              <p className="mb-10">
                From maritime operations across the Red Sea, bridging the continents, to luxury fashion ateliers nestled in Switzerland, our portfolio spans industries and borders. Yet, every entity is unified by one holding vision: unparalleled excellence and sustainable growth.
              </p>
              <button 
                onClick={(e) => scrollToSection(e, "#portfolio")}
                className="group flex items-center gap-4 text-gold hover:text-pearl transition-colors bg-transparent border-none p-0 cursor-pointer text-decoration-none"
              >
                <span className="font-montserrat text-[10px] font-semibold tracking-[0.2em] uppercase">View The Fleet</span>
                <span className="w-10 h-[1px] bg-gold group-hover:bg-pearl transition-colors relative">
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t border-r border-gold group-hover:border-pearl transform rotate-45 transition-colors" />
                </span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ── PORTFOLIO SECTION (Centerpiece Globe) ── */}
      <section id="portfolio" className="bg-navy py-20 relative z-20">
        
        {/* Header */}
        <div className="text-center px-6 mb-12">
          <span className="font-montserrat text-[9px] font-medium tracking-[0.28em] uppercase text-gold block mb-3">
            Portfolio
          </span>
          <h2 className="font-cormorant font-light text-4xl md:text-5xl lg:text-6xl text-pearl mb-4">
            Our Premium Portfolio
          </h2>
          <p className="font-montserrat font-light text-xs text-pearl-dim tracking-wide max-w-[600px] mx-auto">
            Discover a curated collection of marquee ventures across maritime, commerce, architecture, and luxury. Each project exemplifies excellence, innovation, and global reach.
          </p>
        </div>

        {/* Interactive Globe Workspace */}
        <div className="max-w-[1240px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* List Menu of Companies (Brochure Menu) - Left Side */}
          <div className="lg:col-span-3 flex flex-col gap-2 relative z-30">
            <h4 className="font-montserrat text-[10px] font-semibold tracking-[0.2em] uppercase text-gold/60 mb-4 px-3 flex items-center gap-2">
              <Compass className="w-3.5 h-3.5" /> Fleet Registry
            </h4>
            
            <div className="relative h-[160px] lg:h-[500px] overflow-hidden group">
              <div className="flex flex-row lg:flex-col gap-4 w-max lg:w-full absolute left-0 top-0 animate-[autoScrollHorizontal_30s_linear_infinite] lg:animate-[autoScrollList_40s_linear_infinite] group-hover:[animation-play-state:paused]">
                {[...companies, ...companies].map((c, idx) => {
                  const isActive = activeCompany.id === c.id
                  return (
                    <button
                      key={`${c.id}-${idx}`}
                      onClick={() => setActiveCompany(c)}
                      className={`relative overflow-hidden w-[260px] lg:w-full h-[160px] lg:h-[150px] shrink-0 rounded-[2px] transition-all duration-500 cursor-pointer text-left block p-0 ${
                        isActive 
                          ? "border border-gold shadow-[0_0_15px_rgba(201,168,76,0.15)]" 
                          : "border border-gold/10 hover:border-gold/40"
                      }`}
                    >
                      {/* Background Image with slow pan */}
                      <div className="absolute inset-0 z-0">
                        <img 
                          src={c.image} 
                          alt={c.name} 
                          className={`w-full h-full object-cover transition-all duration-700 ${isActive ? "opacity-60 scale-105" : "opacity-30 scale-100 hover:opacity-50 hover:scale-105"}`} 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-transparent" />
                        <div className="absolute inset-0 bg-navy/20 mix-blend-multiply" />
                      </div>

                      {/* Card Content */}
                      <div className="relative z-10 flex flex-col justify-end h-full p-5">
                        <div className="flex justify-between items-center mb-1">
                          <span className={`font-cormorant font-medium text-2xl transition-colors ${isActive ? "text-gold" : "text-pearl"}`}>
                            {c.name}
                          </span>
                          {c.url ? (
                            <ArrowUpRight className="w-3.5 h-3.5 text-gold/60" />
                          ) : (
                            <span className="text-[8px] text-pearl-dim uppercase tracking-widest">Soon</span>
                          )}
                        </div>
                        <span className="font-montserrat text-[8px] font-semibold tracking-[0.2em] text-gold/70 uppercase mb-2 block">
                          {c.cat}
                        </span>
                        <p className="font-montserrat text-[10px] text-pearl-dim line-clamp-2 leading-relaxed m-0">
                          {c.desc}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
            
            {/* Scroll/Fade gradients */}
            <div className="absolute top-10 left-0 w-full h-8 bg-gradient-to-b from-navy to-transparent pointer-events-none hidden lg:block" />
            <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-navy to-transparent pointer-events-none hidden lg:block" />
            <div className="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-navy to-transparent pointer-events-none lg:hidden" />
            <div className="absolute top-0 right-0 w-12 h-full bg-gradient-to-l from-navy to-transparent pointer-events-none lg:hidden" />
          </div>

          {/* Interactive Globe - Center */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative aspect-square max-w-[550px] mx-auto w-full">
            {/* The Globe Component */}
            <GlobeBars 
              markers={globeMarkers} 
              onMarkerClick={handleMarkerClick}
              className="w-full"
            />
            {/* Rotate hints */}
            <span className="font-montserrat text-[8px] tracking-[0.22em] uppercase text-gold/30 pointer-events-none mt-2 select-none animate-[hintPulse_3s_infinite]">
              Drag globe to rotate • Click labels to select
            </span>
          </div>

          {/* Info Details Panel - Right Side */}
          <div className="lg:col-span-3">
            <div 
              key={activeCompany.id} 
              className="glass-panel overflow-hidden rounded-[2px] flex flex-col min-h-[380px] shadow-2xl relative group animate-[fade-in_0.5s_ease-out]"
            >
              {/* Animated Background Image */}
              <div className="absolute inset-0 z-0 pointer-events-none">
                <img 
                  src={activeCompany.image} 
                  alt={activeCompany.name}
                  className="w-full h-full object-cover opacity-10 group-hover:opacity-40 scale-100 group-hover:scale-110 transition-all duration-700 ease-in-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute inset-0 bg-navy/40 mix-blend-multiply" />
              </div>

              {/* Foreground Content */}
              <div className="relative z-10 p-8 flex flex-col h-full transform transition-transform duration-500 group-hover:-translate-y-1">
                <span className="font-montserrat text-[8px] font-medium tracking-[0.28em] uppercase text-gold flex items-center gap-1.5 mb-4">
                  <Anchor className="w-3 h-3" /> {activeCompany.cat}
                </span>
                <h3 className="font-cormorant font-light text-[40px] leading-[0.95] text-pearl mb-3 group-hover:text-gold transition-colors duration-500">
                  {activeCompany.name}
                </h3>
                <div className="font-montserrat text-[8px] tracking-[0.18em] uppercase text-pearl-dim/60 mb-6 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-gold/75" /> {activeCompany.country}
                </div>
                <p className="font-montserrat font-light text-[12px] leading-relaxed text-pearl-dim flex-1 border-t border-gold/8 pt-6">
                  {activeCompany.desc}
                </p>
                
                {activeCompany.url ? (
                  <a 
                    href={activeCompany.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-8 font-montserrat text-[9px] font-medium tracking-[0.2em] uppercase text-gold py-3 px-4 border border-gold/22 rounded-[2px] bg-navy/40 backdrop-blur-sm flex items-center justify-between hover:bg-gold/10 hover:border-gold/60 cursor-pointer text-decoration-none transition-all duration-300"
                  >
                    <span>Visit Website</span>
                    <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </a>
                ) : (
                  <div 
                    className="mt-8 font-montserrat text-[9px] font-medium tracking-[0.2em] uppercase text-pearl-dim/40 py-3 px-4 border border-pearl-dim/10 rounded-[2px] bg-navy/20 backdrop-blur-sm flex items-center justify-between cursor-not-allowed select-none transition-all duration-300"
                  >
                    <span>Website Launching Soon</span>
                    <span className="text-[8px] opacity-45 px-1.5 py-0.5 border border-pearl-dim/20 rounded-[2px]">Standby</span>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── PARALLAX OCEAN DIVIDER ── */}
      <section 
        className="relative h-[60vh] min-h-[400px] bg-cover bg-center bg-fixed flex items-center justify-center overflow-hidden"
        style={{ 
          backgroundImage: "url('/divider_ocean_bg.png')",
          backgroundAttachment: "fixed"
        }}
      >
        <canvas ref={dividerCanvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy via-transparent to-navy z-20 pointer-events-none" />

        <div className="relative text-center z-20">
          <span className="font-montserrat text-[9px] font-medium tracking-[0.28em] uppercase text-gold block mb-4">
            Est. Riyadh · Saudi Arabia
          </span>
          <h2 className="font-cormorant font-light text-5xl md:text-7xl text-pearl leading-none">
            From the depths<br />
            <span className="italic text-pearl/50">of ambition</span>
          </h2>
        </div>
      </section>

      {/* ── TOAST NOTIFICATION ── */}
      <div 
        className={`fixed z-50 bg-deep border border-gold py-5 px-7 rounded-[2px] shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex items-center gap-4 transition-all duration-500 ease-out ${showToast ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={showToast ? { top: toastPos.top, right: toastPos.right } : {}}
        role="alert" 
        aria-live="polite"
      >
        <CheckCircle2 className="w-6 h-6 text-gold" />
        <div>
          <h5 className="font-montserrat text-[11px] font-semibold text-gold uppercase tracking-[0.15em] mb-1">
            Transmission Successful
          </h5>
          <p className="font-montserrat text-xs text-pearl-dim">
            Coordinates received. We will contact you shortly.
          </p>
        </div>
      </div>

      {/* ── MERGED CONTACT & FOOTER ── */}
      <footer id="contact" className="bg-[#020810] pt-32 pb-12 px-6 md:px-16 relative z-20 border-t border-gold/10">
        <div className="max-w-[1300px] mx-auto">
          
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
            
            {/* Left: Brand & Info (Col Span 4) */}
            <div className="md:col-span-4 flex flex-col justify-between">
              <div>
                <span className="font-montserrat text-[10px] font-semibold tracking-[0.35em] text-gold select-none block mb-6">
                  BIG WAVE
                </span>
                <h2 className="font-cormorant font-light text-4xl text-pearl leading-tight mb-8">
                  Set Your<br />Course
                </h2>
                <div className="font-montserrat font-light text-xs leading-[2.2] text-pearl-dim flex flex-col gap-3">
                  <p>
                    <span className="font-medium text-pearl block mb-1">Headquarters</span>
                    International Business District<br />
                    Riyadh, Saudi Arabia
                  </p>
                  <div className="mt-4 flex flex-col gap-2">
                    <a href="mailto:info@bigwave.com" className="flex items-center gap-3 text-pearl-dim hover:text-gold transition-colors text-decoration-none">
                      <Mail className="w-3.5 h-3.5" /> info@bigwave.com
                    </a>
                    <a href="tel:+966000000000" className="flex items-center gap-3 text-pearl-dim hover:text-gold transition-colors text-decoration-none">
                      <Phone className="w-3.5 h-3.5" /> +966 (0) 00 000 0000
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Center: Directory (Col Span 3) */}
            <div className="md:col-span-3">
              <span className="font-montserrat text-[9px] font-medium tracking-[0.2em] uppercase text-pearl/40 block mb-8">
                Fleet Directory
              </span>
              <ul className="flex flex-col gap-4 list-none p-0 m-0">
                {companies.map(c => (
                  <li key={c.id}>
                    <button 
                      onClick={() => {
                        setActiveCompany(c)
                        const target = document.querySelector("#portfolio")
                        if (target) target.scrollIntoView({ behavior: "smooth" })
                      }}
                      className="font-montserrat text-[10px] tracking-[0.15em] uppercase text-pearl-dim hover:text-gold text-left transition-colors cursor-pointer bg-transparent border-none p-0 flex items-center justify-between w-full"
                    >
                      {c.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Contact Form (Col Span 5) */}
            <div className="md:col-span-5 bg-deep/40 p-10 border border-gold/5 rounded-[2px]">
              <span className="font-montserrat text-[9px] font-medium tracking-[0.2em] uppercase text-pearl/40 block mb-8">
                Direct Transmission
              </span>
              <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-5">
                  <input 
                    type="text" 
                    placeholder="Name" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-transparent border-b border-gold/15 py-3 text-pearl font-montserrat text-[11px] font-light outline-none transition-all focus:border-gold placeholder:text-pearl-dim/40" 
                    required 
                  />
                  <input 
                    type="email" 
                    placeholder="Email" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-transparent border-b border-gold/15 py-3 text-pearl font-montserrat text-[11px] font-light outline-none transition-all focus:border-gold placeholder:text-pearl-dim/40" 
                    required 
                  />
                </div>
                <textarea 
                  rows={3} 
                  placeholder="Message" 
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-transparent border-b border-gold/15 py-3 text-pearl font-montserrat text-[11px] font-light outline-none transition-all focus:border-gold placeholder:text-pearl-dim/40 resize-none mt-2" 
                  required 
                />
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="mt-6 font-montserrat text-[9px] font-medium tracking-[0.2em] uppercase py-4 px-8 border border-gold/30 bg-transparent text-gold cursor-pointer hover:bg-gold/10 hover:border-gold w-full transition-all duration-300 disabled:opacity-50 disabled:cursor-wait"
                >
                  {isSubmitting ? "Transmitting..." : "Send Message"}
                </button>
              </form>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center w-full border-t border-gold/10 pt-8 gap-6 font-montserrat text-[9px] text-pearl-dim/50 tracking-[0.1em] select-none">
            <div className="flex gap-6">
              <a href="#portfolio" onClick={(e) => scrollToSection(e, "#portfolio")} className="hover:text-gold transition-colors text-decoration-none">PORTFOLIO</a>
              <a href="#about" onClick={(e) => scrollToSection(e, "#about")} className="hover:text-gold transition-colors text-decoration-none">ABOUT</a>
            </div>
            <span>© {new Date().getFullYear()} BIG WAVE HOLDING COMPANY. ALL RIGHTS RESERVED.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
