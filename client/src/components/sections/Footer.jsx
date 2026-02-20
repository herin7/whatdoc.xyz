import { Link } from 'react-router-dom';

const footerLinks = {
  Product: [
    { label: 'Home', to: '/' },
    { label: 'Pricing', to: '/pricing' },
    { label: 'Changelog', to: '/changelog' },
  ],
  Company: [
    { label: 'About', to: '#' },
    { label: 'Blog', to: '#' },
    { label: 'Contact', to: '#' },
  ],
  Legal: [
    { label: 'Terms of Service', to: '#' },
    { label: 'Privacy Policy', to: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-6 w-6 rounded bg-gradient-to-br from-emerald-400 to-emerald-600" />
              <span className="font-bold text-lg tracking-tight text-white">whatdoc.xyz</span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">
              AI-powered documentation that doesn't look boring. Paste a repo, get instant docs.
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h6 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">{heading}</h6>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-zinc-500 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
          <span>© {new Date().getFullYear()} whatdoc.xyz. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Twitter</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
