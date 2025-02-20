import React from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import {
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart, Pie, Label,
} from "recharts";
import iconBars from '../images/icon-bars.svg';
import iconPie from '../images/icon-pie.svg';
import iconBag from '../images/icon-bag.svg';
import iconNote from '../images/icon-note.svg';
import iconDollarRed from '../images/icon-dollar-red.svg';
import iconDollarGrey from '../images/icon-dollar-grey.svg';
import iconPaperOut from '../images/icon-paper-out.svg';
import iconClockOrange from '../images/icon-clock-orange.svg';
import iconCheckGreen from '../images/icon-check-green.svg';
import iconInfo from '../images/icon-info.svg';
import iconComplete from '../images/icon-complete.svg';
import iconProgress from '../images/icon-progress.svg';
import iconBlocked from '../images/icon-blocked.svg';

export default class MigrDash extends React.Component {
  constructor(props) {
    super();
    this.state = {
      loading: true,
      dashTab: 'overview',
      dashAppTab: 'all-apps',
      migrationData: [
        { name: 'Complete', value: 0, fill: '#0F5044' },
        { name: 'In Process', value: 0, fill: '#278C7C' },
        { name: 'Not Required', value: 0, fill: '#6AC987' },
        { name: 'Postponed', value: 0, fill: '#E5FDF7' },
      ],
      archData: [
        { name: 'Rehost', value: 0, fill: '#E8F4FF' },
        { name: 'Replatform', value: 0, fill: '#8AB8E3' },
        { name: 'Rearchitect', value: 0, fill: '#3D7DB3' },
        { name: 'Others', value: 0, fill: '#0E456B' },
      ],
      mcoeData: [
        { name: 'Complete', value: 0, fill: '#6F0A46' },
        { name: 'Submitted', value: 0, fill: '#AC3378' },
        { name: 'Not Required', value: 0, fill: '#D76AC7' },
        { name: 'Not Required', value: 0, fill: '#FFF0F8' },
      ],
      priorityData: [
        { name: '1', value: 0, fill: '#271561' },
        { name: '2 - 4', value: 0, fill: '#5C4392' },
        { name: '5 - 7', value: 0, fill: '#9077BD' },
        { name: '8 - 9', value: 0, fill: '#C2B1E0' },
      ],
      highlevelData: [
        { name: 'Complete', value: 0, fill: '#6F0A46' },
        { name: 'In Process', value: 0, fill: '#AC3378' },
        { name: 'Not Required', value: 0, fill: '#D76AC7' },
      ],
      targetDateData: [
        { name: 'Q1-2025', value: 0, fill: '#990000' },
        { name: 'Q2-2025', value: 0, fill: '#BF130F' },
        { name: 'Q3-2025', value: 0, fill: '#DF3328' },
        { name: 'Q4-2025', value: 0, fill: '#F5584A' },
        { name: 'Q1-2026', value: 0, fill: '#FF8173' },
        { name: 'Q2-2026', value: 0, fill: '#FFA99F' },
        { name: 'Q3-2026', value: 0, fill: '#FFCDC8' },
        { name: 'Q4-2026', value: 0, fill: '#FCF0F0' },
      ],
      mcoe2Data: [
        { name: 'Complete', value: 0, fill: '#0E456B' },
        { name: 'Submitted', value: 0, fill: '#3D7DB3' },
        { name: 'Not Required', value: 0, fill: '#8AB8E3' },
      ],
      discoveryData: [
        { name: 'Complete', value: 0, fill: '#0E456B' },
        { name: 'In Process', value: 0, fill: '#38848E' },
        { name: 'Not Required', value: 0, fill: '#83C2BC' },
      ],
      designData: [
        { name: 'Complete', value: 0, fill: '#6D164A' },
        { name: 'In Process', value: 0, fill: '#C72887' },
        { name: 'Not Required', value: 0, fill: '#E0E4EA' },
      ],
      migrationExecutionData: [
        { name: 'Complete', value: 0, fill: '#854204' },
        { name: 'In Process', value: 0, fill: '#C66F21' },
        { name: 'Not Required', value: 0, fill: '#F6A968' },
      ],
      optimizationData: [
        { name: 'Complete', value: 0, fill: '#025102' },
        { name: 'In Process', value: 0, fill: '#238E1D' },
        { name: 'Not Required', value: 0, fill: '#72C968' },
      ],
      appsFilterApps: [],
      appsFilterEcif: [],
      appsFilterStatus: [],
      appsFilterPriority: [],
      appsFilterRfactor: [],
      appsFilterCmcoe: [],
      appsFilterTarget: [],
      appsFilterMig: [],
      appsFilterGolive: [],
      appsAllData: [],
      appInfoData: [],
      appMetricsData: [],
      // appTeamData: [],
      // appCommentsData: [],
    }
    this.appActive = React.createRef();
    this.appsFilterEcifSelected = React.createRef();
    this.appsFilterEcifSelected.current = 'All';
    this.appsFilterStatusSelected = React.createRef('All');
    this.appsFilterStatusSelected.current = 'All';
    this.appsFilterPrioritySelected = React.createRef('All');
    this.appsFilterPrioritySelected.current = 'All';
    this.appsFilterRfactorSelected = React.createRef('All');
    this.appsFilterRfactorSelected.current = 'All';
    this.appsFilterCmcoeSelected = React.createRef('All');
    this.appsFilterCmcoeSelected.current = 'All';
    this.appsFilterTargetSelected = React.createRef('All');
    this.appsFilterTargetSelected.current = 'All';
    this.appsFilterMigSelected = React.createRef('All');
    this.appsFilterMigSelected.current = 'All';
    this.appsFilterGoliveSelected = React.createRef('All');
    this.appsFilterGoliveSelected.current = 'All';
    this.setChartData();
  }

  chartDataFetch = async (sheetName) => {
    const spreadsheetId = '18RBHzh21tHTouya9IgxqZafBzzhNikOIRnMF_GkxMKI';
    const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=xlsx`;
    try {
      const response = await axios.get(sheetUrl, { responseType: 'arraybuffer' });
      const data = new Uint8Array(response.data);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      return jsonData;
    } catch (error) {
      console.error('Error fetching spreadsheet:', error);
      return false;
    }
  }

  setChartData = async () => {
    this.setState({ loading: true });

    let chartdata = await this.chartDataFetch('2025 Apps');
    const migrationData = this.state.migrationData;
    const archData = this.state.archData;
    const mcoeData = this.state.mcoeData;
    const priorityData = this.state.priorityData;
    const highlevelData = this.state.highlevelData;
    const targetDateData = this.state.targetDateData;
    const mcoe2Data = this.state.mcoe2Data;
    const discoveryData = this.state.discoveryData;
    const designData = this.state.designData;
    const migrationExecutionData = this.state.migrationExecutionData;
    const optimizationData = this.state.optimizationData;

    migrationData.forEach((item) => {
      let count = 0;
      chartdata.forEach((chartItem) => {
        if (item.name === chartItem['Overall Status']) {
          count++;
        }
      });
      if (count > 0) {
        item.value = count;
      }
    });
    archData.forEach((item) => {
      let count_rehost = 0;
      let count_replatform = 0;
      let count_rearchitect = 0;
      let count_others = 0;
      chartdata.forEach((chartItem) => {
        if (item.name === 'Rehost' && item.name === chartItem['R-Factor']) {
          count_rehost++;
        }
        else if (item.name === 'Replatform' && item.name === chartItem['R-Factor']) {
          count_replatform++;
        }
        else if (item.name === 'Rearchitect' && item.name === chartItem['R-Factor']) {
          count_rearchitect++;
        }
        else if (item.name === 'Others' && chartItem['R-Factor']) {
          count_others++;
        }
      });
      if (count_rehost > 0) {
        item.value = count_rehost;
      }
      if (count_replatform > 0) {
        item.value = count_replatform;
      }
      if (count_rearchitect > 0) {
        item.value = count_rearchitect;
      }
      if (count_others > 0) {
        item.value = count_others;
      }
    });
    mcoeData.forEach((item) => {
      let count = 0;
      chartdata.forEach((chartItem) => {
        if (item.name === chartItem['CMCoE Form']) {
          count++;
        }
      });
      if (count > 0) {
        item.value = count;
      }
    });
    priorityData.forEach((item) => {
      let count_priority_1 = 0;
      let count_priority_2_4 = 0;
      let count_priority_5_7 = 0;
      let count_priority_8_9 = 0;
      chartdata.forEach((chartItem) => {
        if (item.name === '1' && [1].includes(chartItem['Priority'])) {
          count_priority_1++;
        }
        else if (item.name === '2 - 4' && [2, 3, 4].includes(chartItem['Priority'])) {
          count_priority_2_4++;
        }
        else if (item.name === '5 - 7' && [5, 6, 7].includes(chartItem['Priority'])) {
          count_priority_5_7++;
        }
        else if (item.name === '8 - 9' && [8, 9].includes(chartItem['Priority'])) {
          count_priority_8_9++;
        }
      });
      if (count_priority_1 > 0) {
        item.value = count_priority_1;
      }
      if (count_priority_2_4 > 0) {
        item.value = count_priority_2_4;
      }
      if (count_priority_5_7 > 0) {
        item.value = count_priority_5_7;
      }
      if (count_priority_8_9 > 0) {
        item.value = count_priority_8_9;
      }
    });
    highlevelData.forEach((item) => {
      let count = 0;
      chartdata.forEach((chartItem) => {
        if (item.name === chartItem['High Level Assessment']) {
          count++;
        }
      });
      if (count > 0) {
        item.value = count;
      }
    });
    targetDateData.forEach((item) => {
      let count = 0;
      chartdata.forEach((chartItem) => {
        if (item.name === chartItem['Target Date']) {
          count++;
        }
      });
      if (count > 0) {
        item.value = count;
      }
    });

    chartdata = await this.chartDataFetch('Current COE Engagements');
    mcoe2Data.forEach((item) => {
      let count = 0;
      chartdata.forEach((chartItem) => {
        if (item.name === chartItem['CMCOE Intake']) {
          count++;
        }
      });
      if (count > 0) {
        item.value = count;
      }
    });
    discoveryData.forEach((item) => {
      let count = 0;
      chartdata.forEach((chartItem) => {
        if (item.name === chartItem['Discovery/Assessment']) {
          count++;
        }
      });
      if (count > 0) {
        item.value = count;
      }
    });
    designData.forEach((item) => {
      let count = 0;
      chartdata.forEach((chartItem) => {
        if (item.name === chartItem['Migration Design & Planning']) {
          count++;
        }
      });
      if (count > 0) {
        item.value = count;
      }
    });
    migrationExecutionData.forEach((item) => {
      let count = 0;
      chartdata.forEach((chartItem) => {
        if (item.name === chartItem['Migration Execution']) {
          count++;
        }
      });
      if (count > 0) {
        item.value = count;
      }
    });
    optimizationData.forEach((item) => {
      let count = 0;
      chartdata.forEach((chartItem) => {
        if (item.name === chartItem['Optimization']) {
          count++;
        }
      });
      if (count > 0) {
        item.value = count;
      }
    });

    this.setState({ loading: false });
  }

  setChartAppsData = async () => {
    this.setState({ loading: true });
    const chartdata = await this.chartDataFetch('2025 Apps');
    const appsAllDataList = [];
    const appsList = [];
    const appsEcifList = ['All'];
    const appsStatus = ['All'];
    const appsPriority = ['All'];
    const appsRfactor = ['All'];
    const appsCmcoe = ['All'];
    const appsTarget = ['All'];
    const appsMig = ['All'];
    const appsGolive = ['All'];
    chartdata.forEach((item) => {
      if (item['Application']) {
        appsList.push(item['Application']);
      }

      if (item['Funding']) {
        if (!appsEcifList.includes(item['Funding'])) {
          appsEcifList.push(item['Funding']);
        }
      }
      if (item['Overall Status']) {
        if (!appsStatus.includes(item['Overall Status'])) {
          appsStatus.push(item['Overall Status']);
        }
      }
      if (item['Priority']) {
        if (!appsPriority.includes(item['Priority'])) {
          appsPriority.push(item['Priority']);
        }
      }
      if (item['R-Factor']) {
        if (!appsRfactor.includes(item['R-Factor'])) {
          appsRfactor.push(item['R-Factor']);
        }
      }
      if (item['CMCoE Form']) {
        if (!appsCmcoe.includes(item['CMCoE Form'])) {
          appsCmcoe.push(item['CMCoE Form']);
        }
      }
      let targetDate = null;
      if (item['Target Date']) {
        targetDate = item['Target Date'];
        if(!isNaN(targetDate)){
          targetDate = this.dateFormat(targetDate);
        }
        if (!appsTarget.includes(targetDate)) {
          appsTarget.push(targetDate);
        }
      }
      let migDate = null;
      if (item['Milestone: Mig/Mod Prep']) {
        migDate = item['Milestone: Mig/Mod Prep'];
        if(!isNaN(migDate)){
          migDate = this.dateFormat(migDate);
        }
        if (!appsMig.includes(migDate)) {
          appsMig.push(migDate);
        }
      }
      let goliveDate = null;
      if (item['Milestone: Go-Live']) {
        goliveDate = item['Milestone: Go-Live'];
        if(!isNaN(goliveDate)){
          goliveDate = this.dateFormat(goliveDate);
        }
        if (!appsGolive.includes(goliveDate)) {
          appsGolive.push(goliveDate);
        }
      }

      if (
        (this.appsFilterEcifSelected.current == 'All' || this.appsFilterEcifSelected.current == item['Funding']) &&
        (this.appsFilterStatusSelected.current == 'All' || this.appsFilterStatusSelected.current == item['Overall Status']) &&
        (this.appsFilterPrioritySelected.current == 'All' || this.appsFilterPrioritySelected.current == item['Priority']) &&
        (this.appsFilterRfactorSelected.current == 'All' || this.appsFilterRfactorSelected.current == item['R-Factor']) &&
        (this.appsFilterCmcoeSelected.current == 'All' || this.appsFilterCmcoeSelected.current == item['CMCoE Form']) &&
        (this.appsFilterTargetSelected.current == 'All' || this.appsFilterTargetSelected.current == targetDate) &&
        (this.appsFilterMigSelected.current == 'All' || this.appsFilterMigSelected.current == migDate) &&
        (this.appsFilterGoliveSelected.current == 'All' || this.appsFilterGoliveSelected.current == goliveDate)
      ) {
        appsAllDataList.push({
          name: item['Application'],
          overall_status: item['Overall Status'],
          funding: item['Funding'],
          priority: item['Priority'],
          rfactor: item['R-Factor'],
          cmcoe: item['CMCoE Form'],
          target: targetDate,
          mig: migDate,
          golive: goliveDate,
        })
      }
    });
    this.setState({ appsAllData: appsAllDataList });
    this.setState({ appsFilterApps: appsList });
    this.setState({ appsFilterEcif: appsEcifList });
    this.setState({ appsFilterStatus: appsStatus });
    this.setState({ appsFilterPriority: appsPriority });
    this.setState({ appsFilterRfactor: appsRfactor });
    this.setState({ appsFilterCmcoe: appsCmcoe });
    this.setState({ appsFilterTarget: appsTarget });
    this.setState({ appsFilterMig: appsMig });
    this.setState({ appsFilterGolive: appsGolive });

    if (!this.appActive.current || !appsList.includes(this.appActive.current)) {
      this.appActive.current = appsList[0];
    }

    chartdata.forEach((item) => {
      if (item['Application'] == this.appActive.current) {
        const appInfoItems = [];
        appInfoItems.push({ name: 'AIDE', value: item[`AIDE`] });
        appInfoItems.push({ name: 'Sub LOB', value: item[`Sub LOB`] });
        appInfoItems.push({ name: 'Parent App', value: item[`Parent App`] });
        appInfoItems.push({ name: 'Target Platform', value: item[`Target Platform`] });
        appInfoItems.push({ name: 'SVP/SI', value: item[`SVP`] });
        appInfoItems.push({ name: 'R-factor', value: item[`R-Factor`] });
        appInfoItems.push({ name: 'Complexity', value: item[`Complexity`] });
        appInfoItems.push({ name: 'Lead Architect', value: item[`Lead Architect`] });

        const appMetricsItems = [];
        appMetricsItems.push({ name: 'CMCoE Form', value: item[`CMCoE Form`] });
        appMetricsItems.push({ name: 'HighLevel Assessment', value: item[`High Level Assessment`] });
        appMetricsItems.push({ name: 'Current Architecture', value: item[`Current State Architecture`] });
        appMetricsItems.push({ name: 'Intake form', value: item[`Intake Form Complete`] });
        appMetricsItems.push({ name: 'Future Architecture', value: item[`Target Architecture`] });
        appMetricsItems.push({ name: 'Mig/Mod Prep', value: item[`Milestone: Mig/Mod Prep`] });
        appMetricsItems.push({ name: 'Go-Live', value: item[`Milestone: Go-Live`] });

        // const appTeamItems = [];
        // appTeamItems.push({ name: 'Service Level Owner', value: item[`Service Level Owner`] });
        // appTeamItems.push({ name: 'Technical Owner', value: item[`Technical Owner`] });
        // appTeamItems.push({ name: 'Business Owner', value: item[`Business Owner`] });
        // appTeamItems.push({ name: 'Chief Architect', value: item[`Chief Architect`] });
        // appTeamItems.push({ name: 'Primary POC', value: item[`Primary POC`] });

        this.setState({ appInfoData: appInfoItems });
        this.setState({ appMetricsData: appMetricsItems });

        // this.setState({ appTeamData: appTeamItems });
        // this.setState({ appCommentsData: item[`Notes`].split('- ') });
      }
    });
    this.setState({ loading: false });
  }

  dateFormat = (date) => {
    const dateParsed = new Date(Date.UTC(0, 0, date - 1));
    return new Intl.DateTimeFormat('en-US', {month: '2-digit',day: '2-digit',year: 'numeric'}).format(dateParsed);
  }

  handleDashChartMigrationBarClick = (data) => {
    if (data.name) {
      this.setState({ dashTab: 'apps' });
      this.handleDashAppsFilterStatusChange(data.name);
    }
  };
  handleDashChartArchBarClick = (data) => {
    if (data.name) {
      this.setState({ dashTab: 'apps' });
      if (data.name === 'Others') {
        this.handleDashAppsFilterRfactorChange('All');
      } else {
        this.handleDashAppsFilterRfactorChange(data.name);
      }
    }
  };
  handleDashChartMcoeBarClick = (data) => {
    if (data.name) {
      this.setState({ dashTab: 'apps' });
      this.handleDashAppsFilterCmcoeChange(data.name);
    }
  };
  handleDashChartTargetBarClick = (data) => {
    if (data.name) {
      this.setState({ dashTab: 'apps' });
      this.handleDashAppsFilterTargetChange(data.name);
    }
  };

  handleDashTabChange = (tab) => {
    if (tab === 'apps') {
      this.setChartAppsData();
    } else {
      this.setChartData();
    }
    this.setState({ dashTab: tab });
  }

  handleDashAppTabChange = (tab) => {
    this.setState({ dashAppTab: tab });
    this.setChartAppsData();
  }

  handleDashAppsSelect = (app) => {
    this.setState({ dashAppTab: 'detailed-view' });
    this.appActive.current = app;
    this.setChartAppsData();
  }

  handleDashAppsSwitch = (app) => {
    this.appActive.current = app;
    this.setChartAppsData();
  }

  handleDashAppsFilterEcifChange = (filter) => {
    this.appsFilterEcifSelected.current = filter;
    this.setChartAppsData();
  }
  handleDashAppsFilterStatusChange = (filter) => {
    this.appsFilterStatusSelected.current = filter;
    this.setChartAppsData();
  }
  handleDashAppsFilterPriorityChange = (filter) => {
    this.appsFilterPrioritySelected.current = filter;
    this.setChartAppsData();
  }
  handleDashAppsFilterRfactorChange = (filter) => {
    this.appsFilterRfactorSelected.current = filter;
    this.setChartAppsData();
  }
  handleDashAppsFilterCmcoeChange = (filter) => {
    this.appsFilterCmcoeSelected.current = filter;
    this.setChartAppsData();
  }
  handleDashAppsFilterTargetChange = (filter) => {
    this.appsFilterTargetSelected.current = filter;
    this.setChartAppsData();
  }
  handleDashAppsFilterMigChange = (filter) => {
    this.appsFilterMigSelected.current = filter;
    this.setChartAppsData();
  }
  handleDashAppsFilterGoliveChange = (filter) => {
    this.appsFilterGoliveSelected.current = filter;
    this.setChartAppsData();
  }

  render() {
    return (
      <div>
        <div className="migr-dash-tab">
          <span className={"migr-dash-tab-item " + (this.state.dashTab === 'overview' ? 'active' : '')} onClick={() => this.handleDashTabChange('overview')}>Overview</span>
          <span className={"migr-dash-tab-item " + (this.state.dashTab === 'apps' ? 'active' : '')} onClick={() => this.handleDashTabChange('apps')}>CM Apps</span>
          {/* <span className={"migr-dash-tab-item " + (this.state.dashTab === 'coe' ? 'active' : '')} onClick={() => this.handleDashTabChange('coe')}>Current COE Engagement</span> */}
        </div>

        {this.state.loading
          ? <div className="lt-row lt-valign-center lt-halign-center loader-container">
            <div className="loader"></div>
          </div>
          : <div>
            {this.state.dashTab === 'overview' ?
              <div className="migr-dash-tab-body">
                <div className="migr-dash-card">
                  <div className="migr-dash-card-header">
                    <div className="migr-dash-card-header-title">
                      <img className="migr-dash-card-header-title-icon" src={iconBars} />
                      <span>Migration Status</span>
                    </div>
                    <div className="migr-dash-card-header-info">
                      <span className="migr-dash-card-header-info-tooltip">
                        <img src={iconInfo} />
                      </span>
                    </div>
                  </div>
                  <div className='migr-dash-card-body'>
                    <ResponsiveContainer width={"100%"} height={400}>
                      <BarChart data={this.state.migrationData} layout="vertical" overflow="visible"
                        barCategoryGap={50} barSize={50} barGap={0}>
                        <CartesianGrid strokeDasharray="2 3" />
                        <XAxis type="number" allowDataOverflow
                          tick={{ fill: '#99A0AE' }} axisLine={false} tickLine={false}
                          style={{ fontSize: '16px' }} />
                        <YAxis type="category" dataKey="name" width={120} 
                          tickFormatter={(value) => `${value} (${this.state.migrationData.find(item => item.name === value).value})`}
                          axisLine={false} tickLine={false}
                          style={{ fontSize: '18px' }} />
                        <Bar dataKey="value" radius={[5, 5, 5, 5]} stroke="#15A796" strokeWidth={1} onClick={this.handleDashChartMigrationBarClick} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className='lt-row lt-valign-stretch'>
                  <div className='lt-w-32 m-lt-w-100 migr-dash-card'>
                    <div className="migr-dash-card-header">
                      <div className="migr-dash-card-header-title">
                        <img className="migr-dash-card-header-title-icon" src={iconPie} />
                        <span>Architecture Types</span>
                      </div>
                      <div className="migr-dash-card-header-info">
                        <span className="migr-dash-card-header-info-tooltip">
                          <img src={iconInfo} />
                        </span>
                      </div>
                    </div>
                    <div className='migr-dash-card-body'>
                      <ResponsiveContainer width={"100%"} height={400}>
                        <PieChart width={"100%"} height={400}>
                          <text x='50%' y='50%' dy={-65}
                            style={{ fontSize: 19, fontWeight: '500', fill: '#525866' }}
                            width="100%" scaleToFit={true} textAnchor='middle' verticalAnchor='middle'>
                            TOTAL APPS
                          </text>
                          <text x='50%' y='50%' dy={-20}
                            style={{ fontSize: 38, fontWeight: '500', fill: '#0E121B' }}
                            width="100%" scaleToFit={true} textAnchor='middle' verticalAnchor='middle'>
                            {this.state.archData.reduce((acc, item) => acc + item.value, 0)}
                          </text>
                          <Pie data={this.state.archData}
                            cx="50%" cy="50%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius="80%"
                            outerRadius="100%"
                            paddingAngle={1}
                            dataKey="value"
                            onClick={this.handleDashChartArchBarClick} >
                            <Label />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className='lt-row migr-dash-chart-item-row'>
                        {this.state.archData.map((item, index) => (
                          <div key={index} className='lt-w-25 migr-dash-chart-item' onClick={this.handleDashChartArchBarClick}>
                            <div className='migr-dash-chart-item-img'>
                              <img src={index !== this.state.archData.length - 1
                                ? index === 0 ? iconBag : index === 1 ? iconNote : index === 2 ? iconDollarRed : iconDollarGrey
                                : iconDollarGrey} />
                            </div>
                            <div className='migr-dash-chart-item-name'>
                              {item.name}
                            </div>
                            <div className='migr-dash-chart-item-value'>
                              {item.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className='lt-w-32 m-lt-w-100 migr-dash-card'>
                    <div className="migr-dash-card-header">
                      <div className="migr-dash-card-header-title">
                        <img className="migr-dash-card-header-title-icon" src={iconBars} />
                        <span>MCOE Intake</span>
                      </div>
                      <div className="migr-dash-card-header-info">
                        <span className="migr-dash-card-header-info-tooltip">
                          <img src={iconInfo} />
                        </span>
                      </div>
                    </div>
                    <div className='migr-dash-card-body'>
                      <ResponsiveContainer width={"100%"} height={400}>
                        <BarChart data={this.state.mcoeData} layout="vertical" overflow="visible"
                          barCategoryGap={50} barSize={50} barGap={0} >
                          <CartesianGrid strokeDasharray="2 3" />
                          <XAxis type="number" allowDataOverflow
                            tick={{ fill: '#99A0AE' }} axisLine={false} tickLine={false}
                            style={{ fontSize: '16px' }} />
                          <YAxis type="category" dataKey="name" width={120} tickFormatter={(value) => `${value} (${this.state.mcoeData.find(item => item.name === value).value})`}
                            tick={{ fill: '#0E121B' }} axisLine={false} tickLine={false}
                            style={{ fontSize: '18px' }} />
                          <Bar dataKey="value" radius={[5, 5, 5, 5]} stroke="#AC3378" strokeWidth={1} onClick={this.handleDashChartMcoeBarClick} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className='lt-w-32 m-lt-w-100 migr-dash-card'>
                    <div className="migr-dash-card-header">
                      <div className="migr-dash-card-header-title">
                        <img className="migr-dash-card-header-title-icon" src={iconPie} />
                        <span>Based on Priority</span>
                      </div>
                      <div className="migr-dash-card-header-info">
                        <span className="migr-dash-card-header-info-tooltip">
                          <img src={iconInfo} />
                        </span>
                      </div>
                    </div>
                    <div className='migr-dash-card-body'>
                      <ResponsiveContainer width={"100%"} height={400}>
                        <BarChart data={this.state.priorityData} layout="vertical" overflow="visible"
                          barCategoryGap={50} barSize={50} barGap={0} >
                          <CartesianGrid strokeDasharray="2 3" />
                          <XAxis type="number" allowDataOverflow
                            tick={{ fill: '#99A0AE' }} axisLine={false} tickLine={false}
                            style={{ fontSize: '16px' }} />
                          <YAxis type="category" dataKey="name" width={120} tickFormatter={(value) => `${value} (${this.state.priorityData.find(item => item.name === value).value})`}
                            tick={{ fill: '#0E121B' }} axisLine={false} tickLine={false}
                            style={{ fontSize: '18px' }} />
                          <Bar dataKey="value" radius={[5, 5, 5, 5]} stroke="#8061BC" strokeWidth={1} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className='lt-row lt-valign-stretch'>
                  <div className='lt-w-32 m-lt-w-100 migr-dash-card'>
                    <div className="migr-dash-card-header">
                      <div className="migr-dash-card-header-title">
                        <img className="migr-dash-card-header-title-icon" src={iconBars} />
                        <span>High Level Assessment</span>
                      </div>
                      <div className="migr-dash-card-header-info">
                        <span className="migr-dash-card-header-info-tooltip">
                          <img src={iconInfo} />
                        </span>
                      </div>
                    </div>
                    <div className='migr-dash-card-body'>
                      <ResponsiveContainer width={"100%"} height={400}>
                        <BarChart data={this.state.highlevelData} layout="vertical" overflow="visible"
                          barCategoryGap={50} barSize={50} barGap={0} >
                          <CartesianGrid strokeDasharray="2 3" />
                          <XAxis type="number" allowDataOverflow
                            tick={{ fill: '#99A0AE' }} axisLine={false} tickLine={false}
                            style={{ fontSize: '16px' }} />
                          <YAxis type="category" dataKey="name" width={120} tickFormatter={(value) => `${value} (${this.state.highlevelData.find(item => item.name === value).value})`}
                            tick={{ fill: '#0E121B' }} axisLine={false} tickLine={false}
                            style={{ fontSize: '18px' }} />
                          <Bar dataKey="value" radius={[5, 5, 5, 5]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className='lt-w-66 m-lt-w-100 migr-dash-card'>
                    <div className="migr-dash-card-header">
                      <div className="migr-dash-card-header-title">
                        <img className="migr-dash-card-header-title-icon" src={iconBars} />
                        <span>Target Date</span>
                      </div>
                      <div className="migr-dash-card-header-info">
                        <span className="migr-dash-card-header-info-tooltip">
                          <img src={iconInfo} />
                        </span>
                      </div>
                    </div>
                    <div className='migr-dash-card-body'>
                      <ResponsiveContainer width={"100%"} height={400}>
                        <BarChart data={this.state.targetDateData} layout="vertical" overflow="visible"
                          barCategoryGap={50} barSize={50} barGap={0} >
                          <CartesianGrid strokeDasharray="2 3" />
                          <XAxis type="number" allowDataOverflow
                            tick={{ fill: '#99A0AE' }} axisLine={false} tickLine={false}
                            style={{ fontSize: '16px' }} />
                          <YAxis type="category" dataKey="name" width={120} tickFormatter={(value) => `${value} (${this.state.targetDateData.find(item => item.name === value).value})`}
                            tick={{ fill: '#0E121B' }} axisLine={false} tickLine={false}
                            style={{ fontSize: '18px' }} />
                          <Bar dataKey="value" radius={[5, 5, 5, 5]} onClick={this.handleDashChartTargetBarClick} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
              : ''
            }

            {this.state.dashTab === 'apps' ?
              <div className="migr-dash-tab-body">
                <div className="migr-dash-app-tab">
                  <span className={"migr-dash-app-tab-item " + (this.state.dashAppTab === 'all-apps' ? 'active' : '')} onClick={() => this.handleDashAppTabChange('all-apps')}>All Apps</span>
                  <span className={"migr-dash-app-tab-item " + (this.state.dashAppTab === 'detailed-view' ? 'active' : '')} onClick={() => this.handleDashAppTabChange('detailed-view')}>Detailed View</span>
                </div>

                {this.state.dashAppTab === 'all-apps' ?
                  <div className="migr-dash-app-body">
                    <div className="lt-row">
                      <div className="lt-w-11 m-lt-w-45">
                        <label className='migr-dash-selector-label lt-w-100'>ECIF</label>
                        <select name='migr-dash-app-name' className='migr-dash-selector-2 lt-w-100' onChange={(e) => this.handleDashAppsFilterEcifChange(e.target.value)} defaultValue={this.appsFilterEcifSelected.current}>
                          {this.state.appsFilterEcif.map((item, index) => (
                            <option key={index} value={item}>{item}</option>
                          ))}
                        </select>
                      </div>
                      <div className="lt-w-11 m-lt-w-45">
                        <label className='migr-dash-selector-label lt-w-100'>Overall Progress</label>
                        <select name='migr-dash-app-name' className='migr-dash-selector-2 lt-w-100' onChange={(e) => this.handleDashAppsFilterStatusChange(e.target.value)} defaultValue={this.appsFilterStatusSelected.current}>
                          {this.state.appsFilterStatus.map((item, index) => (
                            <option key={index} value={item}>{item}</option>
                          ))}
                        </select>
                      </div>
                      <div className="lt-w-11 m-lt-w-45">
                        <label className='migr-dash-selector-label lt-w-100'>Priority</label>
                        <select name='migr-dash-app-name' className='migr-dash-selector-2 lt-w-100' onChange={(e) => this.handleDashAppsFilterPriorityChange(e.target.value)} defaultValue={this.appsFilterPrioritySelected.current}>
                          {this.state.appsFilterPriority.map((item, index) => (
                            <option key={index} value={item}>{item}</option>
                          ))}
                        </select>
                      </div>
                      <div className="lt-w-11 m-lt-w-45">
                        <label className='migr-dash-selector-label lt-w-100'>R-Factor</label>
                        <select name='migr-dash-app-name' className='migr-dash-selector-2 lt-w-100' onChange={(e) => this.handleDashAppsFilterRfactorChange(e.target.value)} defaultValue={this.appsFilterRfactorSelected.current}>
                          {this.state.appsFilterRfactor.map((item, index) => (
                            <option key={index} value={item}>{item}</option>
                          ))}
                        </select>
                      </div>
                      <div className="lt-w-11 m-lt-w-45">
                        <label className='migr-dash-selector-label lt-w-100'>CM-CoE Form</label>
                        <select name='migr-dash-app-name' className='migr-dash-selector-2 lt-w-100' onChange={(e) => this.handleDashAppsFilterCmcoeChange(e.target.value)} defaultValue={this.appsFilterCmcoeSelected.current}>
                          {this.state.appsFilterCmcoe.map((item, index) => (
                            <option key={index} value={item}>{item}</option>
                          ))}
                        </select>
                      </div>
                      <div className="lt-w-11 m-lt-w-45">
                        <label className='migr-dash-selector-label lt-w-100'>Target Date</label>
                        <select name='migr-dash-app-name' className='migr-dash-selector-2 lt-w-100' onChange={(e) => this.handleDashAppsFilterTargetChange(e.target.value)} defaultValue={this.appsFilterTargetSelected.current}>
                          {this.state.appsFilterTarget.map((item, index) => (
                            <option key={index} value={item}>{item}</option>
                          ))}
                        </select>
                      </div>
                      <div className="lt-w-11 m-lt-w-45">
                        <label className='migr-dash-selector-label lt-w-100'>MIG Date</label>
                        <select name='migr-dash-app-name' className='migr-dash-selector-2 lt-w-100' onChange={(e) => this.handleDashAppsFilterMigChange(e.target.value)} defaultValue={this.appsFilterMigSelected.current}>
                          {this.state.appsFilterMig.map((item, index) => (
                            <option key={index} value={item}>{item}</option>
                          ))}
                        </select>
                      </div>
                      <div className="lt-w-11 m-lt-w-45">
                        <label className='migr-dash-selector-label lt-w-100'>Go Live date</label>
                        <select name='migr-dash-app-name' className='migr-dash-selector-2 lt-w-100' onChange={(e) => this.handleDashAppsFilterGoliveChange(e.target.value)} defaultValue={this.appsFilterGoliveSelected.current}>
                          {this.state.appsFilterGolive.map((item, index) => (
                            <option key={index} value={item}>{item}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className='migr-dash-all-apps-table-wrap'>
                      <div className='migr-dash-all-apps-table'>
                        <div className='lt-row lt-valign-center migr-dash-all-apps-table-head'>
                          <div className='lt-w-20 migr-dash-all-apps-table-head-item'>Name</div>
                          <div className='lt-w-12 migr-dash-all-apps-table-head-item'>Overall Status</div>
                          <div className='lt-w-10 migr-dash-all-apps-table-head-item'>ECIF Funding</div>
                          <div className='lt-w-7 migr-dash-all-apps-table-head-item'>Priority</div>
                          <div className='lt-w-10 migr-dash-all-apps-table-head-item'>R-Factor</div>
                          <div className='lt-w-10 migr-dash-all-apps-table-head-item'>CM-CoE Form</div>
                          <div className='lt-w-10 migr-dash-all-apps-table-head-item'>Target Date</div>
                          <div className='lt-w-10 migr-dash-all-apps-table-head-item'>MIG</div>
                          <div className='lt-w-10 migr-dash-all-apps-table-head-item'>GO-Live</div>
                        </div>
                        {this.state.appsAllData.map((item, index) => (
                          <div className='lt-row lt-valign-center migr-dash-all-apps-table-row' key={index}>
                            <div className='lt-w-20 migr-dash-all-apps-table-item-name'>
                              <span className='migr-dash-all-apps-table-item-name-link' onClick={() => this.handleDashAppsSelect(item.name)}>
                                {item.name}
                              </span>
                            </div>
                            <div className='lt-w-12 migr-dash-all-apps-table-item'>
                              { (item.overall_status === 'Complete' || item.overall_status === 'In Progress') 
                                ? <span className='migr-dash-all-apps-table-item-status'>
                                  <img src={item.overall_status == 'Complete' ? iconCheckGreen : iconClockOrange} />
                                  {item.overall_status}
                                </span>
                                : item.overall_status}
                            </div>
                            <div className='lt-w-10 migr-dash-all-apps-table-item'>{item.funding}</div>
                            <div className='lt-w-7 migr-dash-all-apps-table-item'>{item.priority}</div>
                            <div className='lt-w-10 migr-dash-all-apps-table-item'>{item.rfactor}</div>
                            <div className='lt-w-10 migr-dash-all-apps-table-item'>{item.cmcoe}</div>
                            <div className='lt-w-10 migr-dash-all-apps-table-item'>{item.target}</div>
                            <div className='lt-w-10 migr-dash-all-apps-table-item'>{item.mig}</div>
                            <div className='lt-w-10 migr-dash-all-apps-table-item'>{item.golive}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                : '' }

                {this.state.dashAppTab === 'detailed-view' ?
                  <div className="migr-dash-app-body">
                    <div className="lt-row">
                      <div className="lt-w-32 m-lt-w-100">
                        <select name='migr-dash-app-name' className='migr-dash-selector-3 lt-w-100' onChange={(e) => this.handleDashAppsSwitch(e.target.value)} defaultValue={this.appActive.current}>
                          {this.state.appsFilterApps.map((item, index) => (
                            <option key={index} value={item}>{item}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="lt-row migr-dash-app-info-row">
                      {this.state.appInfoData.map((item, index) => (
                        <div className={`${index === 0 ? 'lt-w-12' : 'lt-w-10'} m-lt-w-50 migr-dash-app-info`} key={index}>
                          <div className='migr-dash-app-info-name'>{item.name}</div>
                          <div className='migr-dash-app-info-val'>{item.value}</div>
                        </div>
                      ))}
                    </div>
                    <div className="lt-row">
                      <div className="lt-w-100">
                        <div className="migr-dash-card">
                          <div className="migr-dash-card-header">
                            <div className="migr-dash-card-header-title">
                              <img className="migr-dash-card-header-title-icon" src={iconPaperOut} />
                              <span>Status</span>
                            </div>
                            {/* <div>
                              <button type="button" className='migr-dash-btn'>See All</button>
                            </div> */}
                          </div>
                          <div className='migr-dash-table'>
                            <div className='lt-row lt-valign-center migr-dash-table-head'>
                              <div className='lt-w-66 migr-dash-table-head-item'>Metrics</div>
                              <div className='lt-w-32 migr-dash-table-head-item lt-text-right'>Status/Target date</div>
                            </div>
                            {this.state.appMetricsData.map((item, index) => (
                              <div className='lt-row lt-valign-center migr-dash-table-row' key={index}>
                                <div className='lt-w-66 migr-dash-table-item'>{item.name}</div>
                                <div className='lt-w-32 migr-dash-table-item lt-text-right'>
                                  { (item.value === 'Complete' || item.value === 'In Progress') 
                                    ? <span className='migr-dash-table-item-status'>
                                      <img src={item.value == 'Complete' ? iconCheckGreen : iconClockOrange} />
                                      {item.value}
                                    </span>
                                    : !isNaN(item.value) ? this.dateFormat(item.value) : item.value}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* <div className="lt-w-32 m-lt-w-100">
                        <div className="migr-dash-card">
                          <div className="migr-dash-card-header">
                            <div className="migr-dash-card-header-title">
                              <img className="migr-dash-card-header-title-icon" src={iconLaptop} />
                              <span>Team</span>
                            </div>
                          </div>
                          <div>
                            {this.state.appTeamData.map((item, index) => (
                              <div className='lt-row lt-halign-start migr-dash-member' key={index}>
                                <div className='migr-dash-member-info'>
                                  <div className='migr-dash-member-info-name'>
                                    <span>{item.name}</span>
                                  </div>
                                  <div className='migr-dash-member-info-position'>
                                    {item.value}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="migr-dash-card">
                          <div className="migr-dash-card-header">
                            <div className="migr-dash-card-header-title">
                              <span>Comments</span>
                            </div>
                          </div>
                          <div>
                            <ul className='migr-dash-comments'>
                              {this.state.appCommentsData.map((item, index) => (
                                item.length > 0 ? <li key={index}>{item}</li> : ''
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div> */}
                    </div>
                  </div>
                : '' }
              </div>
              : ''
            }

            {this.state.dashTab === 'coe' ?
              <div className="migr-dash-tab-body">
                <div className='lt-row lt-valign-stretch'>
                  <div className='lt-w-32 m-lt-w-100 migr-dash-card'>
                    <div className="migr-dash-card-header">
                      <div className="migr-dash-card-header-title">
                        <img className="migr-dash-card-header-title-icon" src={iconPie} />
                        <span>CMCOE Intake</span>
                      </div>
                      {/* <div className="migr-dash-card-header-selector">
                        <select>
                          <option>Last Week</option>
                          <option>Last Month</option>
                        </select>
                      </div> */}
                    </div>
                    <div className='migr-dash-card-body'>
                      <ResponsiveContainer width={"100%"} height={400}>
                        <PieChart width={"100%"} height={400}>
                          <text x='50%' y='50%' dy={-65}
                            style={{ fontSize: 19, fontWeight: '500', fill: '#525866' }}
                            width="100%" scaleToFit={true} textAnchor='middle' verticalAnchor='middle'>
                            TOTAL APPS
                          </text>
                          <text x='50%' y='50%' dy={-20}
                            style={{ fontSize: 38, fontWeight: '500', fill: '#0E121B' }}
                            width="100%" scaleToFit={true} textAnchor='middle' verticalAnchor='middle'>
                            {this.state.mcoe2Data.reduce((acc, item) => acc + item.value, 0)}
                          </text>
                          <Tooltip />
                          <Pie data={this.state.mcoe2Data}
                            cx="50%" cy="50%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius="80%"
                            outerRadius="100%"
                            paddingAngle={1}
                            dataKey="value">
                            <Label />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className='lt-row migr-dash-chart-item-row'>
                        {this.state.mcoe2Data.map((item, index) => (
                          <div key={index} className='lt-w-25 migr-dash-chart-item'>
                            <div className='migr-dash-chart-item-img'>
                              <img src={index !== this.state.mcoe2Data.length - 1
                                ? index === 0 ? iconComplete : index === 1 ? iconProgress : index === 2 ? iconBlocked : iconBlocked
                                : iconBlocked} />
                            </div>
                            <div className='migr-dash-chart-item-name'>
                              {item.name}
                            </div>
                            <div className='migr-dash-chart-item-value'>
                              {item.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className='lt-w-32 m-lt-w-100 migr-dash-card'>
                    <div className="migr-dash-card-header">
                      <div className="migr-dash-card-header-title">
                        <img className="migr-dash-card-header-title-icon" src={iconPie} />
                        <span>Discovery Assessment</span>
                      </div>
                      {/* <div className="migr-dash-card-header-selector">
                        <select>
                          <option>Last Week</option>
                          <option>Last Month</option>
                        </select>
                      </div> */}
                    </div>
                    <div className='migr-dash-card-body'>
                      <ResponsiveContainer width={"100%"} height={400}>
                        <PieChart width={"100%"} height={400}>
                          <text x='50%' y='50%' dy={-65}
                            style={{ fontSize: 19, fontWeight: '500', fill: '#525866' }}
                            width="100%" scaleToFit={true} textAnchor='middle' verticalAnchor='middle'>
                            TOTAL APPS
                          </text>
                          <text x='50%' y='50%' dy={-20}
                            style={{ fontSize: 38, fontWeight: '500', fill: '#0E121B' }}
                            width="100%" scaleToFit={true} textAnchor='middle' verticalAnchor='middle'>
                            {this.state.discoveryData.reduce((acc, item) => acc + item.value, 0)}
                          </text>
                          <Tooltip />
                          <Pie data={this.state.discoveryData}
                            cx="50%" cy="50%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius="80%"
                            outerRadius="100%"
                            paddingAngle={1}
                            dataKey="value">
                            <Label />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className='lt-row migr-dash-chart-item-row'>
                        {this.state.discoveryData.map((item, index) => (
                          <div key={index} className='lt-w-25 migr-dash-chart-item'>
                            <div className='migr-dash-chart-item-img'>
                              <img src={index !== this.state.discoveryData.length - 1
                                ? index === 0 ? iconComplete : index === 1 ? iconProgress : index === 2 ? iconBlocked : iconBlocked
                                : iconBlocked} />
                            </div>
                            <div className='migr-dash-chart-item-name'>
                              {item.name}
                            </div>
                            <div className='migr-dash-chart-item-value'>
                              {item.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className='lt-w-32 m-lt-w-100 migr-dash-card'>
                    <div className="migr-dash-card-header">
                      <div className="migr-dash-card-header-title">
                        <img className="migr-dash-card-header-title-icon" src={iconPie} />
                        <span>Design & Planning</span>
                      </div>
                      {/* <div className="migr-dash-card-header-selector">
                        <select>
                          <option>Last Week</option>
                          <option>Last Month</option>
                        </select>
                      </div> */}
                    </div>
                    <div className='migr-dash-card-body'>
                      <ResponsiveContainer width={"100%"} height={400}>
                        <PieChart width={"100%"} height={400}>
                          <text x='50%' y='50%' dy={-65}
                            style={{ fontSize: 19, fontWeight: '500', fill: '#525866' }}
                            width="100%" scaleToFit={true} textAnchor='middle' verticalAnchor='middle'>
                            TOTAL APPS
                          </text>
                          <text x='50%' y='50%' dy={-20}
                            style={{ fontSize: 38, fontWeight: '500', fill: '#0E121B' }}
                            width="100%" scaleToFit={true} textAnchor='middle' verticalAnchor='middle'>
                            {this.state.designData.reduce((acc, item) => acc + item.value, 0)}
                          </text>
                          <Tooltip />
                          <Pie data={this.state.designData}
                            cx="50%" cy="50%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius="80%"
                            outerRadius="100%"
                            paddingAngle={1}
                            dataKey="value">
                            <Label />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className='lt-row migr-dash-chart-item-row'>
                        {this.state.designData.map((item, index) => (
                          <div key={index} className='lt-w-25 migr-dash-chart-item'>
                            <div className='migr-dash-chart-item-img'>
                              <img src={index !== this.state.designData.length - 1
                                ? index === 0 ? iconComplete : index === 1 ? iconProgress : index === 2 ? iconBlocked : iconBlocked
                                : iconBlocked} />
                            </div>
                            <div className='migr-dash-chart-item-name'>
                              {item.name}
                            </div>
                            <div className='migr-dash-chart-item-value'>
                              {item.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className='lt-w-32 m-lt-w-100 migr-dash-card'>
                    <div className="migr-dash-card-header">
                      <div className="migr-dash-card-header-title">
                        <img className="migr-dash-card-header-title-icon" src={iconPie} />
                        <span>Migration Execution</span>
                      </div>
                      {/* <div className="migr-dash-card-header-selector">
                        <select>
                          <option>Last Week</option>
                          <option>Last Month</option>
                        </select>
                      </div> */}
                    </div>
                    <div className='migr-dash-card-body'>
                      <ResponsiveContainer width={"100%"} height={400}>
                        <PieChart width={"100%"} height={400}>
                          <text x='50%' y='50%' dy={-65}
                            style={{ fontSize: 19, fontWeight: '500', fill: '#525866' }}
                            width="100%" scaleToFit={true} textAnchor='middle' verticalAnchor='middle'>
                            TOTAL APPS
                          </text>
                          <text x='50%' y='50%' dy={-20}
                            style={{ fontSize: 38, fontWeight: '500', fill: '#0E121B' }}
                            width="100%" scaleToFit={true} textAnchor='middle' verticalAnchor='middle'>
                            {this.state.migrationExecutionData.reduce((acc, item) => acc + item.value, 0)}
                          </text>
                          <Tooltip />
                          <Pie data={this.state.migrationExecutionData}
                            cx="50%" cy="50%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius="80%"
                            outerRadius="100%"
                            paddingAngle={1}
                            dataKey="value">
                            <Label />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className='lt-row migr-dash-chart-item-row'>
                        {this.state.migrationExecutionData.map((item, index) => (
                          <div key={index} className='lt-w-25 migr-dash-chart-item'>
                            <div className='migr-dash-chart-item-img'>
                              <img src={index !== this.state.migrationExecutionData.length - 1
                                ? index === 0 ? iconComplete : index === 1 ? iconProgress : index === 2 ? iconBlocked : iconBlocked
                                : iconBlocked} />
                            </div>
                            <div className='migr-dash-chart-item-name'>
                              {item.name}
                            </div>
                            <div className='migr-dash-chart-item-value'>
                              {item.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className='lt-w-32 m-lt-w-100 migr-dash-card'>
                    <div className="migr-dash-card-header">
                      <div className="migr-dash-card-header-title">
                        <img className="migr-dash-card-header-title-icon" src={iconPie} />
                        <span>Optimization</span>
                      </div>
                      {/* <div className="migr-dash-card-header-selector">
                        <select>
                          <option>Last Week</option>
                          <option>Last Month</option>
                        </select>
                      </div> */}
                    </div>
                    <div className='migr-dash-card-body'>
                      <ResponsiveContainer width={"100%"} height={400}>
                        <PieChart width={"100%"} height={400}>
                          <text x='50%' y='50%' dy={-65}
                            style={{ fontSize: 19, fontWeight: '500', fill: '#525866' }}
                            width="100%" scaleToFit={true} textAnchor='middle' verticalAnchor='middle'>
                            TOTAL APPS
                          </text>
                          <text x='50%' y='50%' dy={-20}
                            style={{ fontSize: 38, fontWeight: '500', fill: '#0E121B' }}
                            width="100%" scaleToFit={true} textAnchor='middle' verticalAnchor='middle'>
                            {this.state.optimizationData.reduce((acc, item) => acc + item.value, 0)}
                          </text>
                          <Tooltip />
                          <Pie data={this.state.optimizationData}
                            cx="50%" cy="50%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius="80%"
                            outerRadius="100%"
                            paddingAngle={1}
                            dataKey="value">
                            <Label />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className='lt-row migr-dash-chart-item-row'>
                        {this.state.optimizationData.map((item, index) => (
                          <div key={index} className='lt-w-25 migr-dash-chart-item'>
                            <div className='migr-dash-chart-item-img'>
                              <img src={index !== this.state.optimizationData.length - 1
                                ? index === 0 ? iconComplete : index === 1 ? iconProgress : index === 2 ? iconBlocked : iconBlocked
                                : iconBlocked} />
                            </div>
                            <div className='migr-dash-chart-item-name'>
                              {item.name}
                            </div>
                            <div className='migr-dash-chart-item-value'>
                              {item.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className='lt-w-32 m-lt-w-100'>
                  </div>

                </div>
              </div>
              : ''
            }
          </div>
        }
      </div>
    );
  }
}