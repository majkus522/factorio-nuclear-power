import React from 'react';
import { Container, Grid } from 'fomantic-ui-react';
import update from 'immutability-helper';
import Layout from './Layout';
import Calculator from './Calculator';

type S = {
  layout: Array<Array<boolean>>;
};

const maxCol = 3;
const maxRow = 3;
const defaultLayout = [
  [false, false, false],
  [false, true, false],
  [false, false, false],
];
const baseOutput = 40;

class App extends React.Component<{}, S> {
  constructor(props: {}) {
    super(props);
    this.state = {
      layout: defaultLayout,
    };
  }
  handleClick(rowIdx: number, cellIdx: number) {
    if (rowIdx < 0 || rowIdx >= maxRow) return;
    if (cellIdx < 0 || cellIdx >= maxCol) return;
    this.setState(
      update(this.state, {
        layout: {
          [rowIdx]: {
            [cellIdx]: {
              $set: !this.state.layout[rowIdx][cellIdx],
            },
          },
        },
      })
    );
    this.state.layout[rowIdx][cellIdx] = !this.state.layout[rowIdx][cellIdx];
  }

  calculatePower(): number {
    let accum = 0;
    for (let i = 0; i < maxRow; i++) {
      for (let j = 0; j < maxCol; j++) {
        accum += this.getOutputMultiplier(i, j);
      }
    }
    return accum * baseOutput;
  }

  getOutputMultiplier(rowIdx: number, cellIdx: number): number {
    const layout = this.state.layout;
    if (!layout[rowIdx][cellIdx]) {
      return 0;
    }
    let count = 1;
    if (rowIdx > 0 && layout[rowIdx - 1][cellIdx]) count++;
    if (rowIdx < maxRow - 1 && layout[rowIdx + 1][cellIdx]) count++;
    if (cellIdx > 0 && layout[rowIdx][cellIdx - 1]) count++;
    if (cellIdx < maxCol - 1 && layout[rowIdx][cellIdx + 1]) count++;
    return count;
  }

  render() {
    return (
      <Container>
        <Grid columns={2} divided>
          <Grid.Row centered>
            <h1>Factorio Nuclear Power Plant Calculator</h1>
          </Grid.Row>
          <Grid.Row centered>
            <Grid.Column>
              <Layout
                layout={this.state.layout}
                handleClick={this.handleClick.bind(this)}
                getOutputMultiplier={this.getOutputMultiplier.bind(this)}
                power={this.calculatePower()}
              ></Layout>
            </Grid.Column>
            <Grid.Column>
              <Calculator output={this.calculatePower()}></Calculator>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

export default App;
