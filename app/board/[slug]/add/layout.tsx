import { authOptions } from "@/lib/auth";
import NotAllowed from "@/components/not-allowed";
import { getUserRole } from "@/actions/user/index";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


export default async function Layout({ children }: { children: React.ReactNode }) {

    const session = await getServerSession(authOptions);
    if(!session?.user?.id){
        redirect('/signin');
    }
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