import { getUserRole } from "@/actions/user/index";
import AppBar from "@/components/appbar";
import LandingPage from "@/components/landing-page";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const role = await getUserRole(Number(session?.user?.id));

  return (
    <div className="bg-black">
      <AppBar role={role} />
      <LandingPage />
    </div>
  );
}
