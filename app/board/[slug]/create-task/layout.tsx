import { authOptions } from "@/lib/auth";
import NotAllowed from "@/components/not-allowed";
import { getUserRole } from "@/actions/user/index";
import { getServerSession } from "next-auth";


export default async function Layout({ children }: { children: React.ReactNode }) {

    const session = await getServerSession(authOptions);
    const role = await getUserRole(Number(session?.user?.id));
    if (role !== 'MANAGER') {
        return (
            <NotAllowed />
        )
    }
    else {
        return (
            <>
                {children}
            </>
        )
    }
}