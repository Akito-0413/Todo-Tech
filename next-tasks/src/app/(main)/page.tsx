"use client";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import TaskCard from "@/components/TaskCard/TaskCard";
import { TaskDocument } from "@/models/task";
import Link from "next/link";
import { MdAddTask } from "react-icons/md";
import { useEffect, useState } from "react";

const getAllTasks = async (): Promise<TaskDocument[]> => {
  const response = await fetch(`${process.env.API_URL}/tasks`, {
    cache: "no-store",
  });

  if (response.status !== 200) {
    throw new Error();
  }

  const data = await response.json();
  return data.tasks as TaskDocument[];
};

export default async function MainPage() {
  const [allTasks, setAllTasks] = useState<TaskDocument[]>([]);
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasks = await getAllTasks();
        setAllTasks(tasks);
      } catch (error) {
        console.error("Failed to fetch tasks", error);
      }
    };

    fetchTasks();
  }, []);

  const showSession = () => {
    if (status === "authenticated") {
      return (
        <div className="text-gray-800 p-8 h-full overflow-y-auto pb-24">
          <header className="flex justify-between items-center">
            <h1 className="text-2xl font-bold flex items-center">All Tasks</h1>
            <Link
              href="/new"
              className="flex items-center gap-1 font-semibold border px-4 py-2 rounded-full shadow-sm text-white bg-gray-800 hover:bg-gray-700"
            >
              <MdAddTask className="size-5" />
              <div>Add Task</div>
            </Link>
          </header>
          <div className="mt-8 flex flex-wrap gap-4">
            {allTasks.map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
          <button
            className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            onClick={() => {
              signOut({ redirect: false }).then(() => {
                router.push("/");
              });
            }}
          >
            Sign Out
          </button>
        </div>
      );
    } else if (status === "loading") {
      return <span className="text-[#888] text-sm mt-7">Loading...</span>;
    } else {
      return (
        <Link
          href="/login"
          className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          Sign In
        </Link>
      );
    }
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-xl pb-4">Home</h1>
      {showSession()}
    </main>
  );
}
