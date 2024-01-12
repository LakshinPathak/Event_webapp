import { For, createSignal, createEffect, createMemo } from "solid-js";
import { render } from "solid-js/dom";
import Eliza from "elizabot";

import "./app.css";

function App() {
  const eliza = new Eliza();
  const [comments, setComments] = createSignal([
    { author: "eliza", text: eliza.getInitial() }
  ]);

  let div;

  const autoScroll = createMemo(() => {
    comments();
    return div && div.offsetHeight + div.scrollTop > div.scrollHeight - 20;
  });

  createEffect(() => {
    if (autoScroll()) div.scrollTo(0, div.scrollHeight);
  });

  function handleKeydown(evt) {
    if (evt.key === "Enter") {
      const text = evt.target.value;
      if (!text) return;

      setComments(
        comments().concat({
          author: "user",
          text
        })
      );

      evt.target.value = "";

      const reply = eliza.transform(text);

      setTimeout(() => {
        setComments(
          comments().concat({
            author: "eliza",
            text: "...",
            placeholder: true
          })
        );

        setTimeout(() => {
          setComments(
            comments()
              .filter((comment) => !comment.placeholder)
              .concat({
                author: "eliza",
                text: reply
              })
          );
        }, 500 + Math.random() * 500);
      }, 200 + Math.random() * 200);
    }
  }

  return (
    <div class="chat">
      <h1>Eliza</h1>

      <div class="scrollable" ref={div}>
        <For each={comments()}>
          {(comment) => (
            <article class={comment.author}>
              <span>{comment.text}</span>
            </article>
          )}
        </For>
      </div>

      <input onKeyDown={handleKeydown} />
    </div>
  );
}

render(App, document.getElementById("app"));
