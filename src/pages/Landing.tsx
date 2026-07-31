import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Clock,
  MapPin,
  Shield,
  ShoppingBag,
  Store,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { markAsVisited } from "@/lib/visitTracker";

interface LandingProps {
  onEnter?: () => void;
}

const steps = [
  {
    icon: Store,
    title: "Discover local stores",
    description:
      "Browse trusted neighborhood merchants and find everyday essentials in one place.",
  },
  {
    icon: ShoppingBag,
    title: "Checkout in minutes",
    description:
      "Add to cart, pay securely, and choose a delivery window that fits your day.",
  },
  {
    icon: Truck,
    title: "Track to your door",
    description:
      "Follow every step from packing to delivery with live order updates.",
  },
];

const promises = [
  {
    icon: Clock,
    title: "Same-day delivery",
    description: "Order early and get it today in covered areas.",
  },
  {
    icon: Shield,
    title: "Secure payments",
    description: "Your checkout is protected end to end.",
  },
  {
    icon: MapPin,
    title: "Local-first shopping",
    description: "Support nearby merchants while shopping online.",
  },
];

const Landing = ({ onEnter }: LandingProps) => {
  const navigate = useNavigate();

  const handleEnter = (path: string) => {
    markAsVisited();
    onEnter?.();
    navigate(path);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7f4ef] text-stone-900">
      <nav className="absolute inset-x-0 top-0 z-50">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-3 text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur-md">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <span className="font-display text-2xl font-semibold tracking-tight">
              UrbanMart
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              className="text-white/90 hover:bg-white/10 hover:text-white"
              onClick={() => handleEnter("/shop")}
            >
              Browse
            </Button>
            <Button
              className="bg-white text-stone-900 hover:bg-stone-100"
              onClick={() => navigate("/signin")}
            >
              Sign in
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero — one composition: brand, headline, support, CTAs, full-bleed image */}
      <section className="relative flex min-h-screen items-end overflow-hidden pb-16 pt-28 sm:items-center sm:pb-0 sm:pt-20">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=2400&q=80"
            alt="Fresh groceries and market produce"
            className="h-full w-full object-cover animate-soft-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/45 to-stone-950/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/50 via-transparent to-transparent" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
          <div className="max-w-2xl text-white">
            <p className="animate-fade-up font-display text-5xl font-semibold tracking-tight sm:text-7xl lg:text-8xl">
              UrbanMart
            </p>
            <h1 className="mt-4 animate-fade-up text-2xl font-medium leading-snug text-white/95 sm:text-3xl [animation-delay:120ms]">
              Fresh finds from local merchants, delivered fast.
            </h1>
            <p className="mt-4 max-w-lg animate-fade-up text-base leading-relaxed text-white/75 sm:text-lg [animation-delay:220ms]">
              Shop everyday essentials, exclusive deals, and neighborhood
              favorites — then track every order to your door.
            </p>
            <div className="mt-8 flex animate-fade-up flex-col gap-3 sm:flex-row [animation-delay:320ms]">
              <Button
                size="lg"
                className="h-12 gap-2 bg-emerald-600 px-7 text-base text-white hover:bg-emerald-500"
                onClick={() => handleEnter("/signin")}
              >
                Start shopping
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 border-white/40 bg-white/10 px-7 text-base text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
                onClick={() => handleEnter("/shop")}
              >
                Explore as guest
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-stone-200/80 bg-[#faf8f4] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
              How it works
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
              From browse to doorstep in three steps
            </h2>
          </div>

          <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
            {steps.map((step, index) => (
              <div key={step.title} className="group">
                <div className="mb-5 flex items-center gap-4">
                  <span className="font-display text-4xl font-semibold text-emerald-700/30 transition-colors group-hover:text-emerald-700/60">
                    0{index + 1}
                  </span>
                  <step.icon className="h-6 w-6 text-emerald-700" />
                </div>
                <h3 className="text-xl font-semibold text-stone-900">
                  {step.title}
                </h3>
                <p className="mt-3 text-stone-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promise section with visual */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
          <div className="relative min-h-[360px] overflow-hidden sm:min-h-[480px]">
            <img
              src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=1400&q=80"
              alt="Delivery package ready for customers"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 to-transparent" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Why UrbanMart
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Built for everyday shopping that actually feels easy
            </h2>
            <p className="mt-4 text-stone-600 leading-relaxed">
              Whether you need groceries tonight or gifts this weekend,
              UrbanMart connects you with verified merchants and reliable
              delivery.
            </p>
            <ul className="mt-10 space-y-8">
              {promises.map((item) => (
                <li key={item.title} className="flex gap-4">
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-700/10 text-emerald-800">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-900">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-stone-600">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-stone-900 py-20 text-white sm:py-24">
        <div className="absolute inset-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2000&q=80"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-stone-950/75" />
        <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-5xl">
            Your city&apos;s marketplace is ready
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-stone-300 leading-relaxed">
            Create a free account for favorites, order history, and faster
            checkout — or continue browsing as a guest.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-12 bg-emerald-600 px-8 text-white hover:bg-emerald-500"
              onClick={() => handleEnter("/signup")}
            >
              Create free account
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 border-white/30 bg-transparent px-8 text-white hover:bg-white/10 hover:text-white"
              onClick={() => handleEnter("/")}
            >
              Enter the store
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-stone-200 bg-[#f7f4ef] py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 sm:flex-row sm:px-8">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-emerald-700" />
            <span className="font-display text-lg font-semibold">
              UrbanMart
            </span>
            <span className="text-sm text-stone-500">
              © {new Date().getFullYear()}
            </span>
          </div>
          <div className="flex gap-6 text-sm text-stone-500">
            <button
              type="button"
              className="transition-colors hover:text-stone-900"
              onClick={() => navigate("/contact")}
            >
              Contact
            </button>
            <button
              type="button"
              className="transition-colors hover:text-stone-900"
              onClick={() => handleEnter("/shop")}
            >
              Shop
            </button>
            <button
              type="button"
              className="transition-colors hover:text-stone-900"
              onClick={() => navigate("/signin")}
            >
              Sign in
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
