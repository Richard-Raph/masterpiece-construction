import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { roles } from '@/data/roles';
import { FaUserPlus } from 'react-icons/fa';
import RoleCard from '@/components/RoleCard';

export default function Home() {
  return (
    <>
      <Head>
        <title>Masterpiece Construction | Build Your Construction Network</title>
        <meta name="description" content="Platform for buyers, vendors, and riders in the construction industry" />
      </Head>

      <div className="min-h-dvh bg-mp-light">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto h-[70px] px-4 flex justify-between items-center">
            <div className="flex items-center">
              <Image
                width={50}
                height={50}
                src="/logo-black.webp"
                className="object-contain"
                alt="Masterpiece Construction Logo"
              />
              <span className="hidden md:block font-bold text-2xl text-mp-dark ml-2">
                Masterpiece Construction
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/auth/login" className="hidden md:flex items-center text-mp-primary hover:underline font-medium">
                Login
              </Link>
              <Link
                href="/auth/register"
                className="flex items-center bg-mp-muted text-mp-dark px-4 py-2 rounded-md hover:bg-[#f6c834]! transition"
              >
                <FaUserPlus className="mr-1 md:mr-2" />
                <span>Get Started</span>
              </Link>
            </div>
          </div>
        </nav>

        <main className="mx-auto grid content-between text-center h-auto xl:h-[calc(100dvh-370px)]">
          <div className="gap-4 flex flex-col items-center justify-center relative h-54 w-full after:absolute after:-inset-0 after:block after:bg-[rgba(0,0,0,0.5)]">
            <Image
              fill
              priority
              src="/const.webp"
              alt="Construction Team"
              className="object-cover"
            />

            <h1 className="z-10 relative text-3xl md:text-5xl font-bold text-mp-light px-4">
              Build Your
              <span className="relative my-2 md:mx-4 block md:inline-block before:absolute before:-inset-1 before:block before:-skew-y-3 before:bg-[#f6c834]">
                <span className="relative text-mp-dark">Construction</span>
              </span>
              Network
            </h1>

            <p className="hidden md:block z-10 relative text-xl text-mp-light max-w-3xl mx-auto px-4">
              Streamline projects by connecting as a Buyer, Vendor, or Rider in our ecosystem.
            </p>
          </div>

          <section className="p-10 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 justify-center max-w-5xl mx-auto">
            {roles.map(role => <RoleCard key={role.title} {...role} />)}
          </section>
        </main>

        <footer className="bg-mp-dark h-[300px] text-mp-light py-8 md:py-10">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="flex justify-center mb-6">
              <Image
                width={120}
                height={40}
                src="/logo-white.webp"
                className="object-contain"
                alt="Masterpiece Construction Logo"
              />
            </div>
            <p className="mb-4">© {new Date().getFullYear()} Masterpiece Construction</p>
            <div className="flex justify-center space-x-4 md:space-x-6">
              <Link href="/terms" className="text-mp-gray hover:underline hover:text-[#f6c834]! transition-colors duration-500">Terms</Link>
              <Link href="/privacy" className="text-mp-gray hover:underline hover:text-[#f6c834]! transition-colors duration-500">Privacy</Link>
              <Link href="/contact" className="text-mp-gray hover:underline hover:text-[#f6c834]! transition-colors duration-500">Contact</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
