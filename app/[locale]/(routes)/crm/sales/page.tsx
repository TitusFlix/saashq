import React, { Suspense } from 'react';
import Container from '../../components/ui/Container';
import SuspenseLoading from '@/components/loadings/suspense';
import SalesView from '../components/SalesView';
import { fetchBranches } from '@/actions/crm/get-branches';

const page = async () => {
  const branches = await fetchBranches();
  return (
    <Container
      title="Sales"
      description={'Everything you need to know about sales'}
    >
      <>
        <Suspense fallback={<SuspenseLoading />}>
          <SalesView branchData={branches} />
        </Suspense>
      </>
    </Container>
  );
};

export default page;
