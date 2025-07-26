import { Button } from "./ui/button"
export function ParallaxHero() {
  return (
    <div className="relative h-screen flex w-full items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "url('https://coc.phinma.edu.ph/wp-content/uploads/2024/03/PHINMA-COC-MAIN.jpg')",
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      ></div>
      <div className="absolute inset-0 bg-black/50 z-10"></div>
      <div className="relative z-20 text-center text-white"
          >
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to PHINMA COC Library</h1>
        <p className="text-xl md:text-2xl mb-8">Discover, Learn, and Grow with Us</p>
        <a
          href={`https://phinmacoclibrary-opac.follettdestiny.com/common/servlet/presenthomeform.do?l2m=Home&tm=Home&l2m=Home`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button className="px-6 py-3 bg-primary text-white font-semibold rounded-md hover:bg-primary-600 transition duration-300 ease-in-out transform hover:scale-105">
            Explore Our Collection
          </Button>
        </a>
      </div>
    </div>
  )
}
