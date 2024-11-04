import AppBar from '@/components/appbar'
import CreateProject from '@/components/create-project'
import { getServerSession } from 'next-auth';
import React from 'react'
import { authOptions } from '@/lib/auth';
import { getUserRole } from '@/actions/user/index';

const page = async () => {

  const session = await getServerSession(authOptions);
  const role = await getUserRole(Number(session?.user?.id));

  return (
    <div>
      <AppBar role={role} />
      <div className='m-4 flex-1'>
        <CreateProject role={role} />
      </div>
    </div>
  )
}

export default page