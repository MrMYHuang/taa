import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, withIonLifeCycle, IonButton, IonList, IonItem, IonIcon, IonToast, IonImg, IonLoading, IonLabel } from '@ionic/react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';

import { Settings } from '../models/Settings';
import { TmpSettings } from '../models/TmpSettings';

import './Pages.css';
import { arrowBack, bookmark, shareSocial } from 'ionicons/icons';
import Globals from '../Globals';

var displayItems = [
  { field: "類型", key: "animal_kind" },
  { field: "性別", key: "animal_sex" },
  { field: "體型", key: "animal_bodytype" },
  { field: "毛色", key: "animal_colour" },
  { field: "年紀", key: "animal_age" },
  { field: "狀態", key: "animal_status" },
  { field: "是否絕育", key: "animal_sterilization" },
  { field: "是否施打狂犬病疫苗", key: "animal_bacterin" },
  { field: "流水編號", key: "animal_id" },
  { field: "區域編號", key: "animal_subid" },
  { field: "所屬收容所名稱", key: "shelter_name" },
  { field: "地址", key: "shelter_address" },
  { field: "聯絡電話", key: "shelter_tel" },
  { field: "尋獲地", key: "animal_foundplace" },
  { field: "實際所在地", key: "animal_place" },
  { field: "開放認養時間(起)", key: "animal_opendate" },
  { field: "開放認養時間(迄)", key: "animal_closeddate" },
  { field: "資料異動時間", key: "animal_update" },
  { field: "資料建立時間", key: "animal_createtime" },
  { field: "所屬縣市代碼", key: "animal_area_pkid" },
  { field: "所屬收容所代碼", key: "animal_shelter_pkid" },
  { field: "網頁標題", key: "animal_title" },
  { field: "資料備註", key: "animal_remark" },
  { field: "其他說明", key: "animal_caption" },
  { field: "圖片名稱(原始名稱)", key: "album_name" },
  { field: "異動時間", key: "cDate" },
];

interface Props {
  dispatch: Function;
  settings: Settings;
  tmpSettings: TmpSettings;
}

interface State {
  showToast: boolean;
  toastMessage: string;
}

interface PageProps extends Props, RouteComponentProps<{
  tab: string;
  animalId: string;
}> { }

class _DetailScreen extends React.Component<PageProps, State> {
  constructor(props: PageProps) {
    super(props);
    this.state = {
      showToast: false,
      toastMessage: '',
    };

  }

  get animal() {
    return this.props.tmpSettings.animals.find((a) => a.animal_id === +this.props.match.params.animalId);
  }

  addBookmarkHandler() {
    this.props.dispatch({
      type: "ADD_BOOKMARK",
      bookmark: this.animal?.animal_id,
    });
    this.setState({ showToast: true, toastMessage: '書籤新增成功！' });
  }

  render() {
    var rows = [];
    if (this.animal != null) {
      rows = [];
      for (var i = 0; i < displayItems.length; i++) {
        rows.push(<IonItem key={i} className='textFont'>{displayItems[i].field + "：" + (this.animal as any)[displayItems[i].key]}</IonItem>);
      }
    }

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
              <IonButton fill="clear" slot='start' onClick={e => this.props.history.goBack()}>
                <IonIcon icon={arrowBack} slot='icon-only' />
              </IonButton>

              <IonTitle className='uiFont'>詳細資訊</IonTitle>

              <IonButton fill="clear" slot='end' onClick={e => {
                this.addBookmarkHandler();
              }}>
                <IonIcon icon={bookmark} slot='icon-only' />
              </IonButton>

              <IonButton fill="clear" slot='end' onClick={e => {
                Globals.shareByLink(this.props.dispatch, decodeURIComponent(window.location.href));
              }}>
                <IonIcon icon={shareSocial} slot='icon-only' />
              </IonButton>
            </IonToolbar>
          </IonHeader>
          <IonContent style={{ textAlign: 'center' }}>
            {this.animal == null ?
              <IonLabel className='ion-text-wrap textFont'>此認養動物資料已不存在。</IonLabel>
              :
              <>
                <IonImg src={this.animal?.album_file || ''} className='detailScreenImg' alt='' />
                <IonList>
                  {rows}
                </IonList>
              </>
            }

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
}

const mapStateToProps = (state: any /*, ownProps*/) => {
  return {
    tmpSettings: { ...state.tmpSettings },
    settings: { ...state.settings }
  }
};

//const mapDispatchToProps = {};

const DetailScreen = withIonLifeCycle(_DetailScreen);

export default connect(
  mapStateToProps,
)(DetailScreen);
