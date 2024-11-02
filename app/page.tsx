import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const HomePage = async () => {
  const session = await getServerSession();

  if (session) {
    redirect("/dashboard");
  } else {
    redirect("/authentication");
  }
};

export default HomePage;
