# Questiosn

## 1. What is the difference between Component and PureComponent? give an example where it might break my app.

In react Component and PureComponent both are base Classes on which a class can extend from in order to
create react components using classes, example:

```js
class MyComponent extends React.Component {
  ...
}
class MyComponent extends React.PureComponent {
  ...
}
```

The main difference between both is how it handles state and props updates. PureComponent component
can avoid some re-renders, but with the tradeoff only having shallow state comparisons, because of
this fact, if you work with deeply nested states would be easy to break the application and cause bugs,
in react hooks it would be something close to React.memo.

## 2. Context + ShouldComponentUpdate might be dangerous. Can think of why is that?
I personally haven't used much context in class components, only in react hooks. But ShouldComponentUpdate,
gives the following interface:

```js
shouldComponentUpdate(nextProps, nextState): boolean
```
so it only makes re-renders based on state and props comparisons.


## 3. Describe 3 ways to pass information from a component to its PARENT.

here I will stick to native react approaches.

### 1. Context
Context allows sharing information between components no matter if it is child or parent,
it just needs to be wrapped in the context provider.

### 2. Callbacks and props functions
You can pass functions to children components and call them with the information needed.

### 3. Ref
You can pass ref from parent component to children.

## 4. Give 2 ways to prevent components from re-rendering.

### 1. Memoization
In react it is possible to improve performance by preventing unnecessary re-renders by using memoization
technics from hooks such as `useMemo`, `useCallback` and the `React.memo`

### 2. ShouldComponentUpdate
This method was mentioned on previous question, on react Classes components that is also a way
to prevent unecessary re-renders since you are able to make comparisons with `nextProps` and `nextState`.

## 5. What is a fragment and why do we need it? Give an example where it might break my app.
Fragment is an empty component that can be used when you do not want to wrap you components with
any dom node. As far as I know it is not possible to break the application, unless you use an old react
version or dependency that does not support it, but it would be a very rare case.

However, it is possible that sometimes devs would get confused by having to return divs for styling propose 
instead of fragments, who knows...

## 6. Give 3 examples of the HOC pattern.

HOC itself is already a pattern, only the syntax you use to accomplish this may vary. It is the
technic of running a parent component to render a child component, in react usually as a function
that starts `withSomething`, it can be used to perform logics, authentication, stylings, etc.

```jsx
function withLog(Component) {
  return function(props) {
    console.log('props:', props);
    return <Component {...props} />;
  }
}

const MyComponentWithLog = withLog(Component);

<MyComponentWithLog whatEverProps="Hello World!" /> // Hello World!
```

the above example will log props before rendering the component.

## 7. what's the difference in handling exceptions in promises, callbacks and async...await.

### 1. Promises

```js
  const myPromise = new Promise((resolve, reject) => {
    ...
  })

  myPromise
    .then(() => {})
    .catch(err => console.error(err))
```
### 2. Callbacks

```js
  const myFetchFn = (callback) => {
    someAction(function (err, data) {
      if (err) {
        callback(err)
      } else {
        callback(null, data);
      }
    })
  }

  myFetchFn(function (err, data) {
    ...
  })
```

### 3. Async/Await

```js
  const myAsyncFunc = async () => {
    try {
      const response = await fetch(url)
      const data = await response.json()
      console.log(data)
    } catch (err) {
      console.log(err)
    }
  }
```

## 8. How many arguments does setState take and why is it async.
2 arguments a function or new state object

```js
this.setState((prevState, props) => {})
// or
this.setState({ ... })
```

in react hooks `setState` from `useState`

```js
setState((prevState) => {})
// or
setState({ ... })
// or
setState(val: string | boolean | number)
```

## 9. List the steps needed to migrate a Class to Function Component.
Well it is a bit more complicated, because it may depend on the component, but in general here is:

1. update class syntax to a function that receives props param

2. remove all `this.props.something` with only `props.something`

3. remove state object and move it to `useState` hook

4. remove all `this.state` and `this.setState`calls to using `state` and `setState`,
I've added the hooks `setState` interface above.

5. remove `render()` call and just return jsx component

6. remove all lifecycle logic and class based functions into it own separated helper functions

7. if applicable some lifecycle logics can go to `useEffect`

```js
useEffect(() => {
// componentDidMount
return () => {}
}, [])

  useEffect(() => {
    // componentDidUpdate
  }, [...props, ...states]);

    useEffect(() => {
      return () => {
      // cleanups
      // componentWillUnmount
    }
  }, []);
```
8. test it

## 10. List a few ways styles can be used with components.
1. style prop or in-line
2. external vanilla css file
3. css modules
4. sass
5. css-in-js (styled-components, emotion, stitches, etc.)
6. tailwind

## 11. How to render an HTML string coming from the server.

```jsx
const serverHtml = '<span>Hello world!</span>'
<div dangerouslySetInnerHTML={{__html: serverHtml}} ></div>
// or
React.createElement('div', { dangerouslySetInnerHTML: serverHtml })
```
or you can use some third party libraries `react-html-parser` is one.
