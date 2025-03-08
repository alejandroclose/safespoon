import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Clock, ShieldCheck, RefreshCw, FileText, ChevronRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header - simplified */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/placeholder.svg?height=28&width=28"
              alt="AllergenMenu Logo"
              width={28}
              height={28}
              className="rounded"
            />
            <span className="text-lg font-medium">AllergenMenu</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link href="#features" className="text-sm text-gray-600 hover:text-gray-900">
              Features
            </Link>
            <Link href="#pricing" className="text-sm text-gray-600 hover:text-gray-900">
              Pricing
            </Link>
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
              Login
            </Link>
          </nav>
          <div>
            <Button asChild className="hidden md:inline-flex rounded-md px-4">
              <Link href="/signup">Create Free Menu</Link>
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <span className="sr-only">Toggle menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section - refined spacings and cleaner layout */}
        <section className="w-full py-16 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-[1fr_450px] lg:gap-12 xl:grid-cols-[1fr_550px] items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-medium tracking-tight sm:text-4xl xl:text-5xl">
                    Create Professional Allergen Menus in Minutes
                  </h1>
                  <p className="max-w-[520px] text-gray-500 md:text-lg">
                    Meet compliance requirements and keep your guests safe with clear, professional allergen
                    information. 100% free.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button asChild size="lg" className="rounded-md px-5">
                    <Link href="/signup">Get Started</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="rounded-md px-5">
                    <Link href="#how-it-works" className="flex items-center">
                      Learn More
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              <Image
                src="/placeholder.svg?height=550&width=550"
                width={550}
                height={550}
                alt="Restaurant owner creating a menu"
                className="mx-auto aspect-square overflow-hidden rounded-lg object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>

        {/* Key Benefits Section - more minimalistic cards */}
        <section id="features" className="w-full py-16 md:py-24 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-3 text-center mb-12">
              <h2 className="text-2xl font-medium tracking-tight md:text-3xl">Why Choose AllergenMenu?</h2>
              <p className="mx-auto max-w-[600px] text-gray-500 md:text-lg">
                Our platform makes it easy to create professional allergen menus that keep your customers safe and
                your business compliant.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center space-y-3 rounded-lg border border-gray-100 bg-white p-6">
                <Clock className="h-8 w-8 text-gray-900" />
                <h3 className="text-lg font-medium">Save Time</h3>
                <p className="text-center text-gray-500 text-sm">
                  Create professional allergen menus in minutes, not hours
                </p>
              </div>
              <div className="flex flex-col items-center space-y-3 rounded-lg border border-gray-100 bg-white p-6">
                <ShieldCheck className="h-8 w-8 text-gray-900" />
                <h3 className="text-lg font-medium">Increase Safety</h3>
                <p className="text-center text-gray-500 text-sm">Clear allergen labeling keeps your customers safe</p>
              </div>
              <div className="flex flex-col items-center space-y-3 rounded-lg border border-gray-100 bg-white p-6">
                <RefreshCw className="h-8 w-8 text-gray-900" />
                <h3 className="text-lg font-medium">Easy to Update</h3>
                <p className="text-center text-gray-500 text-sm">Simple to maintain as your menu changes</p>
              </div>
              <div className="flex flex-col items-center space-y-3 rounded-lg border border-gray-100 bg-white p-6">
                <FileText className="h-8 w-8 text-gray-900" />
                <h3 className="text-lg font-medium">Professional</h3>
                <p className="text-center text-gray-500 text-sm">
                  Polished, branded output that enhances your reputation
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works - cleaner steps */}
        <section id="how-it-works" className="w-full py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-3 text-center mb-12">
              <h2 className="text-2xl font-medium tracking-tight md:text-3xl">How It Works</h2>
              <p className="mx-auto max-w-[600px] text-gray-500 md:text-lg">
                Create your allergen menu in three simple steps
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-base font-medium text-gray-900">
                  1
                </div>
                <h3 className="text-lg font-medium">Enter Menu Items</h3>
                <p className="text-center text-gray-500 text-sm">Add your menu items and ingredients to the platform</p>
                <div className="relative w-full aspect-video mt-2 overflow-hidden rounded-lg border border-gray-200">
                  <Image
                    src="/placeholder.svg?height=200&width=300"
                    fill
                    alt="Enter menu items"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-base font-medium text-gray-900">
                  2
                </div>
                <h3 className="text-lg font-medium">Mark Allergens</h3>
                <p className="text-center text-gray-500 text-sm">
                  Identify allergens and dietary preferences for each item
                </p>
                <div className="relative w-full aspect-video mt-2 overflow-hidden rounded-lg border border-gray-200">
                  <Image
                    src="/placeholder.svg?height=200&width=300"
                    fill
                    alt="Mark allergens"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-base font-medium text-gray-900">
                  3
                </div>
                <h3 className="text-lg font-medium">Download & Share</h3>
                <p className="text-center text-gray-500 text-sm">
                  Download your custom allergen menu and share with customers
                </p>
                <div className="relative w-full aspect-video mt-2 overflow-hidden rounded-lg border border-gray-200">
                  <Image
                    src="/placeholder.svg?height=200&width=300"
                    fill
                    alt="Download and share"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-10">
              <Button asChild size="lg" className="rounded-md px-6">
                <Link href="/signup">Create Your Free Menu</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials Section - cleaner cards */}
        <section className="w-full py-16 md:py-24 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-3 text-center mb-12">
              <h2 className="text-2xl font-medium tracking-tight md:text-3xl">What Our Users Say</h2>
              <p className="mx-auto max-w-[600px] text-gray-500 md:text-lg">
                Hear from restaurant owners who have transformed their allergen menus
              </p>
            </div>
            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex flex-col space-y-4 rounded-lg border border-gray-100 bg-white p-6">
                <p className="text-gray-600">
                  "AllergenMenu has saved us so much time and helped us provide clear information to our guests with
                  dietary restrictions. Our customers appreciate the transparency, and we've seen increased confidence
                  from diners with allergies."
                </p>
                <div className="flex items-center gap-3 pt-2 mt-auto">
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    width={40}
                    height={40}
                    alt="Testimonial avatar"
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-medium text-sm">Sarah Johnson</p>
                    <p className="text-xs text-gray-500">Owner, The Green Table</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-4 rounded-lg border border-gray-100 bg-white p-6">
                <p className="text-gray-600">
                  "Creating allergen menus used to be a headache for our staff. With AllergenMenu, we can update our
                  information quickly and provide professional-looking menus that keep our customers safe and our
                  business compliant."
                </p>
                <div className="flex items-center gap-3 pt-2 mt-auto">
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    width={40}
                    height={40}
                    alt="Testimonial avatar"
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-medium text-sm">Michael Chen</p>
                    <p className="text-xs text-gray-500">Chef, Fusion Bistro</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sample Menu Preview - cleaner styling */}
        <section className="w-full py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-3 text-center mb-10">
              <h2 className="text-2xl font-medium tracking-tight md:text-3xl">
                See What Your Menu Could Look Like
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-500 md:text-lg">
                Professional, clear, and customizable to match your brand
              </p>
            </div>
            <div className="mx-auto max-w-4xl">
              <div className="rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <Image
                  src="/placeholder.svg?height=800&width=1200"
                  width={1200}
                  height={800}
                  alt="Sample allergen menu"
                  className="w-full"
                />
              </div>
              <div className="flex justify-center mt-10">
                <Button asChild size="lg" className="rounded-md px-6">
                  <Link href="/signup">Create Your Own Menu</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - more subtle styling */}
      <footer className="w-full border-t border-gray-100 py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <div className="flex items-center gap-2">
            <Image
              src="/placeholder.svg?height=24&width=24"
              alt="AllergenMenu Logo"
              width={24}
              height={24}
              className="rounded"
            />
            <span className="text-base font-medium">AllergenMenu</span>
          </div>
          <div className="flex gap-6">
            <Link href="/contact" className="text-sm text-gray-500 hover:text-gray-900">
              Contact
            </Link>
            <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-900">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-900">
              Privacy
            </Link>
          </div>
          <div className="flex gap-4">
            <Link href="#" className="text-gray-400 hover:text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
              <span className="sr-only">Facebook</span>
            </Link>
            <Link href="#" className="text-gray-400 hover:text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="#" className="text-gray-400 hover:text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
              <span className="sr-only">Instagram</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}