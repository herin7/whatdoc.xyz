import { Link } from 'react-router-dom';

export default function Logo({ className = 'text-lg', linked = true }) {
    const content = (
        <span className={`logo tracking-tight ${className}`}>
            {' '}<span className="font-bold">W</span>HATDOC.XYZ
        </span>
    );

    if (linked) {
        return (
            <Link to="/" className="flex items-center gap-2">
                {content}
            </Link>
        );
    }

    return content;
}
