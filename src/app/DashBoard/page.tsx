// import UserActivityTracker from "@/components/UserActivityTracker";
import { auth } from "../../../auth";
import Basic from "./Basic";

const Page = async () => {
  const session = await auth();
  return <>
    {/* (<UserActivityTracker /> */}
   <Basic session={session} />
   </>;
};

export default Page;
