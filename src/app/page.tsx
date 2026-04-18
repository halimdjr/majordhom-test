import ContactForm from "@/components/ContactForm";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 md:p-7 bg-[#ffffff]">
      <div className="w-full max-w-[1400px]">
        <ContactForm />
      </div>
    </main>
  );
}