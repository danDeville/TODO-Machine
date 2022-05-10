// Base
import React, { useState } from "react"

// Redux
import { useDispatch, useSelector } from "react-redux"
import { combineReducers } from "redux"

// Hook
import useDarkMode from "./hook/useDarkMode"

// Reducer
export const filterReducer = (state = "all", action) => {
  switch (action.type) {
    case "filter/set":
      return action.payload
    default:
      return state
  }
}

export const todosReducer = (state = [], action) => {
  switch (action.type) {
    case "todo/add": {
      return state.concat({ ...action.payload })
    }
    case "todo/complete": {
      const newTodos = state.map((todo) => {
        if (todo.id === action.payload.id) {
          return { ...todo, completed: !todo.completed }
        }
        return todo
      })
      return newTodos
    }
    case "todo/remove": {
      return state.filter((todo) => todo.id !== action.payload.id)
    }
    default:
      return state
  }
}

// Store
export const reducer = combineReducers({
  entities: todosReducer,
  filter: filterReducer,
})

// Filter
const selectTodos = (state) => {
  const { entities, filter } = state

  if (filter === "completed") {
    return entities.filter((todo) => todo.completed)
  }

  if (filter === "active") {
    return entities.filter((todo) => !todo.completed)
  }

  return entities
}

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

// Component TodoItem
const TodoItem = ({ todo }) => {
  const dispatch = useDispatch()
  return (
    <div className="group flex flex-row items-center justify-between p-6">
      <section
        onClick={() => dispatch({ type: "todo/complete", payload: todo })}
        className="
          flex flex-row
          items-center justify-start
          w-full cursor-pointer
        "
      >
        <div
          className={classNames(
            todo.completed
              ? "bg-gradient-to-b from-cyan-400 to-purple-600"
              : "bg-transparent border",
              "flex flex-row items-center justify-center w-8 h-8 rounded-full text-white mr-3"
          )}
        >
          <i
            style={{
              display: todo.completed ? "block" : "none"
            }}
            class="ri-check-line"
            >
          </i>
        </div>
        <li
          className={classNames(
            todo.completed
              ? "text-[#39394B] line-through dark:text-[#C9CCE7]"
              : "text-[#C9CCE7] no-underline dark:text-[#39394B]",
            "group w-full"
          )}
        >
          {todo.title}
        </li>
      </section>

      <button
        className="
        group-hover:inline-block hidden
        text-2xl text-[#39394B] dark:text-[#9293A4]
      "
        onClick={() => dispatch({ type:"todo/remove", payload: todo }) }
      >
        <i class="ri-close-line"></i>
      </button>
    </div>
  )
}

const App = () => {
  const [colorTheme, setTheme] = useDarkMode()
  const [value, setValue] = useState("")
  const dispatch = useDispatch()
  const todos = useSelector(selectTodos)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!value.trim()) {
      return
    }

    const id = Math.random().toString(36)
    const todo = { title: value, completed: false, id }
    dispatch({ type: "todo/add", payload: todo })
    setValue("")
  }

  return (
    <div
      className="
        w-screen h-screen
        overflow-hidden
        bg-[#24263C] dark:bg-[#F9F9F9]
        transition-all duration-500
      "
    >
      <header
        className="
          w-full h-96
          bg-cover bg-no-repeat
          bg-[url('https://res.cloudinary.com/dz8on44po/image/upload/v1652041413/R2S2/fuvurwnzgjzpisvc8dgi.jpg')]
          md:bg-[url('https://res.cloudinary.com/dz8on44po/image/upload/v1652041418/R2S2/r4ramip58pyqng3iahyn.jpg')]
          dark:bg-[url('https://res.cloudinary.com/dz8on44po/image/upload/v1652041413/R2S2/p1li5w83gdj25hcacbwa.jpg')]
          dark:md:bg-[url('https://res.cloudinary.com/dz8on44po/image/upload/v1652041413/R2S2/lnz4atzqppesnfeojjcc.jpg')]
        "
      >
      </header>

      <main className="w-full h-full p-4">
        <div
          className="
            absolute top-20 sm:top-36 left-4 right-0 md:left-0
            w-full max-w-xs sm:max-w-2xl md:max-w-3xl
            my-0 mx-auto
          "
        >
          <section
            className="
              flex flex-row
              items-center justify-between
              w-full mb-10
            "
          >
            <h1 className="text-4xl font-semibold text-white">
              TODO
            </h1>

            <div
              onClick={() => setTheme(colorTheme)}
              className="text-3xl text-white"
            >
              {colorTheme === "light" ? (
                <i className="ri-contrast-2-line"></i>
              ) : (
                <i className="ri-sun-fill"></i>
              )}
            </div>
          </section>

          <section className="w-full mb-9">
            <form onSubmit={handleSubmit}>
              <input
                className="
                  w-full h-16 p-6
                  bg-[#161721] dark:bg-white rounded outline-0
                  text-white dark:text-[#39394B]
                "
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Create a new todo...."
              />
            </form>
          </section>

          <div
            className="
              w-full h-[450px]
              overflow-y-auto
              rounded-t-lg
              bg-[#161721] dark:bg-white
              shadow-xl shadow-black dark:shadow-slate-200
            "
          >
            {todos.length === 0
              ? (
                <div
                  className="
                    flex flex-col
                    items-center justify-center
                    w-full h-full
                  "
                >
                  <img
                    className="h-56"
                    src="https://res.cloudinary.com/dz8on44po/image/upload/v1652131462/R2S2/xdeyu2mjpobcsa8katca.svg"
                    alt="Empty State"
                  />
                  <h2
                    className="
                      text-white dark:text-[#39394B]
                      text-3xl font-light text-center mt-4
                    "
                  >
                    No hay tareas
                  </h2>
                </div>
              )
              : (
                <ul className="divide-y divide-slate-200">
                  {todos.map((todo) => (
                    <TodoItem key={todo.id} todo={todo} />
                  ))}
                </ul>
              )
            }
          </div>

          <footer
            className="
              flex flex-col sm:flex-row
              items-center justify-between
              w-full max-w-xs sm:max-w-2xl md:max-w-3xl h-24 sm:h-16
              p-4 sm:p-6 rounded-b-lg
              bg-[#161721] dark:bg-white
              shadow-xl shadow-black dark:shadow-slate-200
              text-[#39394B] dark:text-[#9293A4]
              border-t
            "
          >
            <p className="hover:text-[#E3E4F1] dark:hover:text-[#39394B]">
              {todos.length} items left
            </p>

            <div>
              <button
                className="text-[#3A7BFD]"
                onClick={() => dispatch({ type: "filter/set", payload: "all" })}
              >
                All
              </button>
              <button
                className="px-6 hover:text-[#E3E4F1] dark:hover:text-[#39394B]"
                onClick={() =>
                  dispatch({ type: "filter/set", payload: "active" })
                }
              >
                Active
              </button>
              <button
                className="hover:text-[#E3E4F1] dark:hover:text-[#39394B]"
                onClick={() =>
                  dispatch({ type: "filter/set", payload: "completed" })
                }
              >
                Completed
              </button>
            </div>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default App
