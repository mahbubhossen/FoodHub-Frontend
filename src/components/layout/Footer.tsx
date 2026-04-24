import { ROUTES } from "@/constants";
import { ChefHat } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link
              href={ROUTES.HOME}
              className="flex items-center gap-2 font-bold text-xl mb-4"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <ChefHat className="h-5 w-5" />
              </span>
              <span className="text-primary">Food</span>
              <span>Hub</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Connecting food lovers with the best local restaurants. Fresh
              meals, fast delivery, and amazing flavors — delivered right to
              your door.
            </p>
            <div className="flex items-center gap-3 mt-4">
             {[FaFacebook, FaTwitter, FaInstagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: "Browse Meals", href: ROUTES.MEALS },
                { label: "Login", href: ROUTES.LOGIN },
                { label: "Sign Up", href: ROUTES.REGISTER },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>support@foodhub.com</li>
              <li>+1 (555) 123-4567</li>
              <li>Mon–Fri, 9am – 6pm</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} FoodHub. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with ❤️ for food lovers everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
}
