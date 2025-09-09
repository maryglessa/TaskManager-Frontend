import Head from 'next/head'
import TaskManager from '../components/TaskManager'

export default function Home() {
  return (
    <>
      <Head>
        <title>Task Manager</title>
        <meta name="description" content="A simple task management application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <TaskManager />
      </main>
    </>
  )
}

