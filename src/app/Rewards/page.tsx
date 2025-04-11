import { auth } from "../../../auth";

import RewardsContainer from "./RewardsContainer"; 

const Page = async () => {
  const session = await auth(); 

  return <RewardsContainer session={session} />;
};


export default Page;
