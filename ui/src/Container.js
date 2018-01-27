import React from 'react';
import { observer, inject } from 'mobx-react';
import { autorun } from 'mobx';
import { Tabs } from 'antd';

import router from './tabConfig';

const TabPane = Tabs.TabPane;
const Home = router.home;

@inject(({ store }) => store.tab)
@observer
export default class Container extends React.Component {
  componentWillMount() {
    autorun(() => {
    });
  }

  onTabEdit = (key, action) => {
    if (action !== 'remove') {
      return;
    }

    this.props.rootStore.tab.remove(key);
  };

  onTabChange = (key) => {
    this.props.rootStore.tab.go(key);
  };

  render() {
    return (
      <div className="container">
        <Tabs activeKey={this.props.tab} type="editable-card" hideAdd onChange={this.onTabChange}
              onEdit={this.onTabEdit}>
          <TabPane key="home" tab="首页" closable={false}>
            <div className="tab-card-content">
              <Home />
            </div>
          </TabPane>
          {
            this.props.tabs.map(el => (
              <TabPane key={el.key} tab={el.tab} closable>
                <div className="tab-card-content">
                  <el.component {...el.props} />
                </div>
              </TabPane>
            ))
          }
        </Tabs>
      </div>
    );
  }
}
