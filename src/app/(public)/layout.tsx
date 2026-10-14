import Navbar from "@/components/public/Navbar";
import HiggsfieldBackground from "@/components/public/HiggsfieldBackground";
import Footer from "@/components/public/Footer";
import PremiumScroll from "@/components/public/PremiumScroll";
import * as articleRepo from "@/lib/repositories/article.repository";

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // The blog link stays out of the nav until there is something published to
    // link to. A read failure also keeps it hidden, which is the safe default.
    const publishedArticles = await articleRepo.countPublishedArticles().catch(() => 0);

    return (
        <>
            {/* Background Layer - FIXED and OUTSIDE scroll context */}
            <HiggsfieldBackground />

            <PremiumScroll>
                <div
                    id="scroll-root"
                    className="relative min-h-screen"
                >
                    <Navbar showBlog={publishedArticles > 0} />

                    <main className="relative z-10 min-h-screen">
                        {children}
                    </main>

                    <Footer />
                </div>
            </PremiumScroll>
        </>
    );
}
