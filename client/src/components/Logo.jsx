import { Link } from 'react-router-dom';
import logoImg from '../assets/logo.png';

export default function Logo({ className = 'text-lg', linked = true, showImage = false }) {
    const content = showImage ? (
        <span className={`font-logo flex items-center gap-2 ${className}`}>
            <img src={logoImg} alt="WhatDoc" className="h-6 w-auto" />
        </span>
    ) : (
        <span className={`font-logo ${className}`}>
            <span className="font-bold">W</span>HATDOC.XYZ
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
