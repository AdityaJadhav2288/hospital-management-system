export function PublicFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-primary">CityCare Hospital</h3>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Advanced multi-specialty care with 24x7 emergency response, critical care, diagnostics, and digital
            patient services.
          </p>
        </div>
        <div>
          <h4 className="font-semibold">Quick Links</h4>
          <div className="mt-2 space-y-1 text-sm text-muted-foreground">
            <a href="/services" className="block hover:text-foreground">Services</a>
            <a href="/doctors" className="block hover:text-foreground">Doctors</a>
            <a href="/about" className="block hover:text-foreground">About</a>
            <a href="/contact" className="block hover:text-foreground">Contact</a>
          </div>
        </div>
        <div>
          <h4 className="font-semibold">Contact</h4>
          <p className="mt-2 text-sm text-muted-foreground">+91 1800-123-911</p>
          <p className="text-sm text-muted-foreground">care@citycare.health</p>
          <p className="text-sm text-muted-foreground">123 Health Avenue, Bengaluru</p>
          <p className="mt-2 text-sm text-danger">Emergency: 102 / +91 1800-500-102</p>
        </div>
      </div>
      <div className="border-t border-border px-4 py-4 text-center text-xs text-muted-foreground">
        {new Date().getFullYear()} CityCare Hospital. All rights reserved.
      </div>
    </footer>
  );
}
