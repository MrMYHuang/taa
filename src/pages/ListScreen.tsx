import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, withIonLifeCycle, IonButton, IonIcon, IonList, IonItem, IonToast, IonInfiniteScroll, IonInfiniteScrollContent, IonLoading, IonSelect, IonSelectOption, IonInput, IonLabel } from '@ionic/react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';


import { Settings } from '../models/Settings';
import { TmpSettings } from '../models/TmpSettings';
import Globals from '../Globals';
import { shareSocial } from 'ionicons/icons';

import './ListScreen.css';
import { Animal } from '../models/Animal';
import AnimalCell from '../components/AnimalCell';

class Filter {
  field: string = '';
  key: string = '';
}

const filters: Filter[] = [
  { field: "類型", key: "animal_kind" },
  { field: "地址", key: "shelter_address" },
  { field: "所屬收容所名稱", key: "shelter_name" },
  { field: "性別", key: "animal_sex" },
  { field: "毛色", key: "animal_colour" },
  { field: "體型", key: "animal_bodytype" },
  { field: "是否絕育", key: "animal_sterilization" },
  { field: "是否施打狂犬病疫苗", key: "animal_bacterin" },
  { field: "流水編號", key: "animal_id" },
  { field: "區域編號", key: "animal_subid" },
  { field: "聯絡電話", key: "shelter_tel" },
  { field: "實際所在地", key: "animal_place" },
  { field: "年紀", key: "animal_age" },
  { field: "尋獲地", key: "animal_foundplace" },
  { field: "狀態", key: "animal_status" },
  { field: "開放認養時間(起)", key: "animal_opendate" },
  { field: "開放認養時間(迄)", key: "animal_closeddate" },
  { field: "資料異動時間", key: "animal_update" },
  { field: "資料建立時間", key: "animal_createtime" },
];

class FilterSel {
  id: number = 0;
  key: string = 'animal_kind';
  search: string = '';
}

interface Props {
  dispatch: Function;
  settings: Settings;
  tmpSettings: TmpSettings;
}

interface State {
  animalsLoaded: Animal[];
  filtersSel: FilterSel[];
  isScrollOn: boolean;
  showToast: boolean;
  toastMessage: string;
}

interface PageProps extends Props, RouteComponentProps<{
  tab: string;
}> { }

class _ListScreen extends React.Component<PageProps, State> {
  animalsFiltered: Animal[] = [];

  constructor(props: any) {
    super(props);
    this.state = {
      animalsLoaded: [],
      filtersSel: [new FilterSel()],
      isScrollOn: false,
      showToast: false,
      toastMessage: '',
    };

    this.fetachDataPageByPage(true);
  }

  filterRegExp: RegExp[] = [];

  rows = 20;
  loadMoreLock = false;
  async fetachDataPageByPage(fromStart: boolean = false) {
    await new Promise<void>((ok, fail) => {
      let timer = setInterval(() => {
        if (!this.props.tmpSettings.isLoading && this.props.settings.appInitialized) {
          if (this.animalsFiltered.length === 0 && this.filterRegExp.length === 0) {
            this.animalsFiltered = this.props.tmpSettings.animals;
          }
          clearInterval(timer);
          ok();
        }
      }, 50);
    });

    if (this.loadMoreLock) {
      return;
    }
    this.loadMoreLock = true;


    const animalsLength = this.animalsFiltered.length;

    const animalsRandomlySelected = (new Array(this.rows).fill(0)).map(v => this.animalsFiltered[Math.floor(Math.random() * animalsLength)]).filter(a => a != null);
    const animalsLoaded = fromStart ? animalsRandomlySelected : [...this.state.animalsLoaded, ...animalsRandomlySelected];

    this.setState({
      animalsLoaded: animalsLoaded,
      isScrollOn: animalsLoaded.length < animalsLength,
    }, () => {
      this.loadMoreLock = false;
    });

    return true;
  }

  async selectDetail(animalId: number) {
    this.props.history.push(`${Globals.pwaUrl}/${this.props.match.params.tab}/${animalId}`);
  }

  renderFilterRows() {
    return this.state.filtersSel.map((fs, i) => {
      return <IonItem className='uiFont' key={`filterRow${i}`}>
        <IonLabel className='uiFont'>條件：</IonLabel>
        <IonSelect
          value={this.state.filtersSel[i].id}
          className='uiFont ionSelect'
          interface='popover'
          onIonChange={e => {
            const value = +e.detail.value;
            // Important! Because it can results in rerendering of this component but
            // store states (this.props) of this component is not updated yet! And IonSelect value will be changed
            // back to the old value and onIonChange will be triggered again!
            // Thus, we use this check to ignore this invalid change.
            if (+this.state.filtersSel[i].id === value) {
              return;
            }

            let filtersSel = this.state.filtersSel;
            filtersSel[i].id = value;
            filtersSel[i].key = filters[value].key;
            this.setState({ filtersSel: filtersSel });
          }}
        >
          {
            filters.map((f, j) => <IonSelectOption className='uiFont' key={`selOpt${j}`} value={j}>
              {f.field}
            </IonSelectOption>)
          }
        </IonSelect>

        <IonLabel className='uiFont'>符合：</IonLabel>
        <IonInput
          value={this.state.filtersSel[i].search}
          className='ionInput'
          clearInput={true}
          onIonChange={e => {
            let filtersSel = this.state.filtersSel;
            filtersSel[i].search = e.detail.value || '';
            this.setState({ filtersSel })
          }}></IonInput>

        <IonButton fill='outline' shape='round' size='large' className='uiFont' onClick={e => {
          this.state.filtersSel.splice(i, 1);
          this.setState({ filtersSel: this.state.filtersSel });
        }}>刪除</IonButton>
      </IonItem>
    });
  }

  renderRows() {
    return this.state.animalsLoaded.map((a, i) =>
      <IonItem className='textFont' button={true} key={`item${i}`} onClick={(e) => {
        this.selectDetail(a.animal_id);
      }}>
        <AnimalCell
          {...{
            animal: a,
            ...this.props
          }}
        />
      </IonItem>);
  }

  render() {
    return (
      this.props.tmpSettings.isLoading ?
        <IonLoading
          cssClass='uiFont'
          isOpen={this.props.tmpSettings.isLoading}
          message={'載入中...'}
        />
        :
        <IonPage>
          <IonHeader>
            <IonToolbar>
              <IonTitle className='uiFont'>認養動物</IonTitle>

              <IonButton fill="clear" slot='end' onClick={e => {
                Globals.shareByLink(this.props.dispatch, decodeURIComponent(window.location.href));
              }}>
                <IonIcon icon={shareSocial} slot='icon-only' />
              </IonButton>
            </IonToolbar>
          </IonHeader>
          <IonContent style={{ textAlign: 'center' }}>

            <IonList>
              {this.renderFilterRows()}
            </IonList>

            <IonButton fill='outline' shape='round' size='large' className='uiFont' onClick={e => {
              this.state.filtersSel.push(new FilterSel());
              this.setState({ filtersSel: this.state.filtersSel });
            }}>新增條件</IonButton>
            <IonButton fill='outline' shape='round' size='large' className='uiFont' onClick={e => {
              this.filterRegExp = this.state.filtersSel.map((fs, i) => new RegExp(`.*${this.state.filtersSel[i].search}.*`));
              this.animalsFiltered = this.props.tmpSettings.animals.filter(a => {
                let match = true;
                for (let i = 0; i < this.filterRegExp.length; i++) {
                  const searchText = this.state.filtersSel[i].search;
                  if (searchText !== '') {
                    const key = this.state.filtersSel[i].key;
                    const thisMatch = this.filterRegExp[i].test((a as any)[key]);
                    match = match && thisMatch;
                  }
                }
                return match;
              });
              this.fetachDataPageByPage(true);
            }}>搜尋</IonButton>

            <IonList>
              {this.renderRows()}

              <IonInfiniteScroll threshold="100px"
                disabled={!this.state.isScrollOn}
                onIonInfinite={(ev: CustomEvent<void>) => {
                  this.fetachDataPageByPage();
                  (ev.target as HTMLIonInfiniteScrollElement).complete();
                }}>
                <IonInfiniteScrollContent
                  loadingText="載入中...">
                </IonInfiniteScrollContent>
              </IonInfiniteScroll>
            </IonList>

            <IonToast
              cssClass='uiFont'
              isOpen={this.state.showToast}
              onDidDismiss={() => this.setState({ showToast: false })}
              message={this.state.toastMessage}
              duration={2000}
            />
          </IonContent>
        </IonPage>
    );
  }
};

const mapStateToProps = (state: any /*, ownProps*/) => {
  return {
    tmpSettings: { ...state.tmpSettings },
    settings: { ...state.settings }
  }
};

//const mapDispatchToProps = {};

const ListScreen = withIonLifeCycle(_ListScreen);

export default connect(
  mapStateToProps,
)(ListScreen);
