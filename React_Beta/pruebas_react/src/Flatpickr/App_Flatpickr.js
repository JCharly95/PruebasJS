import "flatpickr/dist/themes/material_green.css";

import Flatpickr from "react-flatpickr";
import { Component } from "react";

export default class Flatpickr_Calen extends Component {
  constructor() {
    super();

    this.state = {
      date: new Date()
    };
  }

  render() {
    const { date } = this.state;
    return (
      <Flatpickr
        data-enable-time
        value={date}
        onChange={([date]) => {
          this.setState({ date });
        }}
      />
    );
  }
}