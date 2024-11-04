import React, { Suspense } from 'react';
import Container from '../components/ui/Container';

import type { Session } from 'next-auth';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

import ProjectsView from './_components/ProjectsView';
import SuspenseLoading from '@/components/loadings/suspense';

export const maxDuration = 60;

const ProjectsPage = async () => {
  const session: Session | null = await getServerSession(authOptions);

  if (!session) return redirect('/sign-in');

  return (
    <Container
      title="Projects"
      description={'Everything you need to know about projects'}
    >
      <Suspense fallback={<SuspenseLoading />}>
        <ProjectsView />
      </Suspense>
    </Container>
  );
};

export default ProjectsPage;
