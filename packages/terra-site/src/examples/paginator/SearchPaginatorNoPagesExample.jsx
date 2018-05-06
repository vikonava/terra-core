import React from 'react';
import Dialog from 'terra-dialog';
import Paginator from 'terra-paginator/src/Paginator';

const maxPages = 5;

class SearchPaginatorNoPagesExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      content: <h2>Welcome!</h2>,
      currentPage: 1,
    };

    this.buildPage = this.buildPage.bind(this);
    this.changePages = this.changePages.bind(this);
  }

  fillArray(value, len) {
    var arr = [];
    for (var i = 0; i < len; i++) {
      arr.push(<p key={Math.floor(Math.random() * Math.floor(100000))}>{value}</p>);
    }
    return arr;
  }

  changePages(direction) {
    const index = direction === 'next' ? this.state.currentPage + 1 : this.state.currentPage - 1;

    if (index >= maxPages) {
      this.setState({ content: <h2>No more pages...</h2>, currentPage: maxPages })
    } else if (index <= 1) {
      this.setState({ content: <h2>Welcome!</h2>, currentPage: 1 });
    } else {
      this.setState({ content: this.buildPage(), currentPage: index });
    }
  }

  buildPage() {
    let fullContent = [];
    const content = ("Lorem ipsum dolor sit amet, consectetur adipiscing elit. \
      Fusce porttitor ullamcorper nisi, vel tincidunt dui pharetra vel. \
      Morbi eu rutrum nibh, sit amet placerat libero. Integer vel dapibus nibh. \
      Donec tempor mi vitae lorem congue, ut ultrices metus feugiat. Sed non commodo felis. \
      Aliquam eget maximus dui, ut rhoncus augue.");

    fullContent = this.fillArray(content, 10);

    return (
      fullContent
    );
  }

  render() {
    return (
      <div style={{ height: '500px' }}>
        <Dialog header={<h1>Page {this.state.currentPage}</h1>} footer={<Paginator onPageChange={this.changePages} />}>
          {this.state.content}
        </Dialog>
      </div>
    );
  }
}

export default SearchPaginatorNoPagesExample;
