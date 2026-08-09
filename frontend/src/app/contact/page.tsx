import { Navbar } from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <section className="py-24 px-8 max-w-5xl mx-auto w-full flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          
          {/* Left Column - Info */}
          <div>
            <span className="font-sans text-sm tracking-[0.3em] uppercase text-primary mb-6 block">Get in Touch</span>
            <h1 className="font-heading text-5xl font-normal text-foreground mb-8">
              Visit Our Showroom
            </h1>
            <div className="space-y-8 font-sans text-muted-foreground">
              <div>
                <h3 className="text-foreground uppercase tracking-widest text-xs mb-2">Address</h3>
                <p>Main Road, Biratnagar<br />Morang, Nepal</p>
              </div>
              <div>
                <h3 className="text-foreground uppercase tracking-widest text-xs mb-2">Phone</h3>
                <p>+977-21-XXXXXX</p>
              </div>
              <div>
                <h3 className="text-foreground uppercase tracking-widest text-xs mb-2">Business Hours</h3>
                <p>Sunday - Friday: 10:00 AM - 7:00 PM<br />Saturday: Closed</p>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="bg-muted/50 p-10">
            <h2 className="font-heading text-3xl mb-8">Send an Inquiry</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2">Full Name</label>
                <input type="text" className="w-full bg-transparent border-b border-border py-2 px-0 outline-none focus:border-primary transition-colors" placeholder="Your Name" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2">Email Address</label>
                <input type="email" className="w-full bg-transparent border-b border-border py-2 px-0 outline-none focus:border-primary transition-colors" placeholder="your@email.com" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2">Message</label>
                <textarea rows={4} className="w-full bg-transparent border-b border-border py-2 px-0 outline-none focus:border-primary transition-colors resize-none" placeholder="How can we help you?"></textarea>
              </div>
              <Button type="button" className="w-full bg-foreground text-background hover:bg-foreground/90 uppercase tracking-widest py-6">
                Send Message
              </Button>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-24 w-full h-[450px] bg-muted relative grayscale hover:grayscale-0 transition-all duration-700">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3571.9962226725056!2d87.2808216!3d26.455850699999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ef74470bf51b29%3A0x1502855e2442f691!2sShree%20Subha%20Laxmi%20Jewellery!5e0!3m2!1sen!2snp!4v1786269315697!5m2!1sen!2snp" 
            className="absolute inset-0 w-full h-full border-0" 
            allowFullScreen={false} 
            loading="lazy" 
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </section>
    </main>
  );
}
