import { authOptions } from "@/lib/auth";
import TaskList from "@/components/task-list";
import { getUserRole } from "@/actions/user/index";
import { getServerSession } from "next-auth";

export default async function Page({ params, }: { params: Promise<{ slug: string }> }) {

    const session = await getServerSession(authOptions);
    const role = await getUserRole(Number(session?.user?.id));

    // asynchronous access of `params`.
    const slug = (await params).slug

    return (
        <div className="m-4 flex-1">
            <TaskList role={role} id={Number(slug)} />
        </div>
    )
}