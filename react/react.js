// import React, { Component } from "react";

// class App extend Component {
// 	render () {
// 		return (
// 			<div>hello React</div>
// 		)
// 	}
// }
const e = React.createElement;

const Button = () => {
	// 显示一个 "Like" <button>
	return e(
	  'button',
	  { onClick: () => this.setState({ liked: true }) },
	  '我是一个按钮'
	);	
}

const Button1 = () => {
	return (
		<button onClick={() => this.setState({ liked: true })}>
		    Like
		</button>
	)
}

ReactDOM.render(
	e(Button),
	document.querySelector("#app") 
);