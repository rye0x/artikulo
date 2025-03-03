import Navbar from "@/components/navbar"

export default function landingPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4">
        <Navbar />
        <div className="mt-8">
          <h1 className="text-3xl font-bold">Welcome to Arkitect</h1>
          <p className="mt-4 text-lg">We design beautiful spaces that inspire and elevate.</p>
        </div>
        {Array(20)
          .fill(0)
          .map((_, i) => (
            <p key={i} className="mt-4">
              This is a paragraph of text to enable scrolling. You will see the navbar change as you scroll down.
            </p>
          ))}
      </div>
    </main>
  )
}
