import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { roles } from '@/data/roles';
import RoleCard from '@/components/RoleCard';
import { FaSignInAlt, FaUserPlus } from 'react-icons/fa';

export default function Home() {
  return (
    <>
      <Head>
        <title>Masterpiece Construction | Connect Your Construction Network</title>
        <meta name="description" content="Platform for buyers, vendors, and riders in the construction industry" />
      </Head>

      <div className="h-dvh bg-mp-light">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Image
                width={40}
                height={40}
                src="/logo.webp"
                className="object-contain"
                alt="Masterpiece Construction Logo"
              />
              <span className="font-bold text-2xl text-mp-dark">
                Masterpiece Construction
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/auth/login" className="flex items-center text-mp-primary hover:underline font-medium">
                <FaSignInAlt className="mr-2" />
                Login
              </Link>
              <Link
                href="/auth/register"
                className="flex items-center bg-mp-muted text-mp-dark px-4 py-2 rounded-md hover:bg-[#f6c834]! transition"
              >
                <FaUserPlus className="mr-2" />
                Get Started
              </Link>
            </div>
          </div>
        </nav>

        <main className="mx-auto grid content-between text-center h-[calc(100%-354px)]">
          <div className="gap-4 flex flex-col items-center justify-center relative h-54 w-full after:absolute after:-inset-0 after:block after:bg-[rgba(0,0,0,0.5)]">
            <Image
              fill
              priority
              src="/const.webp"
              alt="Construction Team"
              className="object-cover"
            />

            <h1 className="z-10 relative text-4xl md:text-5xl font-bold text-mp-light">
              Build Your
              <span className="relative mx-4 inline-block before:absolute before:-inset-1 before:block before:-skew-y-3 before:bg-[#f6c834]">
                <span className="relative text-mp-dark">Construction</span>
              </span>
              Network
            </h1>
            <p className="z-10 relative text-xl text-mp-light max-w-3xl mx-auto">
              Streamline your projects by connecting as a Buyer, Vendor, or Rider in our ecosystem.
            </p>
          </div>

          <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-8 justify-center max-w-5xl mx-auto">
            {roles.map(role => <RoleCard key={role.title} {...role} />)}
          </div>
        </main>

        <footer className="bg-mp-dark text-mp-light py-10">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="flex justify-center mb-6">
              <Image
                width={120}
                height={40}
                src="/logo.webp"
                className="object-contain"
                alt="Masterpiece Construction Logo"
              />
            </div>
            <p className="mb-4">© {new Date().getFullYear()} Masterpiece Construction</p>
            <div className="flex justify-center space-x-6">
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
