import type { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        default: "Blog | Audio Cutter - Free Audio Tools & Guides",
        template: "%s | AudioCutter.site Blog",
    },
};

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
