import React from "react";

function DashboardComp({ name = "", data = [] , totalClicks=0}) {
  return (
    <div className="dashboard-Comp">
      <span className="comp-title">{name}</span>
      <div className="detailed-comp-table">
        {data && data?.length ? (
          data.map((elem,index) => {
            return (
              <div className="detailes-single-table" key={index}>
                <span className="table-chart-text">{elem.name}</span>
                <span className="table-charts">
                <span className="table-charts-inner" style={{
                    width:`${((elem.count/totalClicks)*100)}%`
                }} />
                </span>
                <span className="table-chart-text text-end">{elem.count}</span>
              </div>
            );
          })
        ) : (
          <div className="no-data">
            <p>No data available</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardComp;
