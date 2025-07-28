import Link from "next/link";


export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen">
      
        <Link
          href="/login"
          className="bg-amber-300 px-5 py-2 w-20 h-12 flex justify-center items-center rounded"
        >
          Login
        </Link>
      
    </div>
  );
}
