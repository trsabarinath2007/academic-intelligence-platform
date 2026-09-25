import React, { useEffect, useMemo, useState } from "react";
import { Users, GraduationCap, CalendarCheck, ClipboardList, ArrowUpRight, AlertTriangle, BookOpen, FileCheck2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Layout from "../components/Layout";
import { Card, StatCard, StatusPill, LoadingState, ErrorState } from "../components/UI";
import { apiGet } from "../api";

export default function AdminDashboard(){
 const [data,setData]=useState(null); const [courses,setCourses]=useState([]); const [loading,setLoading]=useState(true); const [error,setError]=useState("");
 const load=async()=>{try{setLoading(true);const [a,c]=await Promise.all([apiGet("/admin-analytics/overall-performance"),apiGet("/courses")]);setData(a);setCourses(c.courses||[]);setError("")}catch(e){setError(e.message)}finally{setLoading(false)}};
 useEffect(()=>{load()},[]);
 if(loading)return <Layout role="admin" title="Overview"><LoadingState text="Loading admin dashboard..."/></Layout>;
 if(error)return <Layout role="admin" title="Overview"><ErrorState message={error} retry={load}/></Layout>;
 const s=data?.summary||{}, students=data?.performance||[], depts=data?.departmentAnalytics||[], risk=data?.atRiskStudents||[];
 const dept=depts.map(d=>({name:d.department,gpa:Number(d.averageGPA||0)}));
 return <Layout role="admin" title="Overview">
  <div className="dashboard-head"><div><div className="eyebrow">Administration</div><h1>Good morning, Admin <span>👋</span></h1><p>Here's an overview of your institution's academic performance.</p></div><div className="date-chip">Thursday, 24 Sep 2026</div></div>
  <div className="stats-grid">
   <StatCard title="Total Students" value={s.totalStudents||0} note="Registered students" icon={Users} tone="blue"/>
   <StatCard title="Average GPA" value={s.averageGPA||0} note="Institution average" icon={GraduationCap} tone="purple"/>
   <StatCard title="Average Attendance" value={`${s.averageAttendance||0}%`} note="Institution average" icon={CalendarCheck} tone="green"/>
   <StatCard title="Average Quiz Score" value={`${s.averageQuizScore||0}%`} note="Assessment performance" icon={ClipboardList} tone="orange"/>
  </div>
  <div className="grid-3">
   <Card title="Student GPA Performance" subtitle="GPA distribution across all students"><div className="chart-box">{students.length?<ResponsiveContainer><BarChart data={students} margin={{top:8,right:8,left:-20,bottom:0}}><CartesianGrid stroke="#edf1f6" strokeDasharray="3 3" vertical={false}/><XAxis dataKey="studentId" tick={{fontSize:10,fill:"#708099"}} axisLine={false} tickLine={false}/><YAxis domain={[0,10]} tick={{fontSize:10,fill:"#708099"}} axisLine={false} tickLine={false}/><Tooltip/><Bar dataKey="gpa" fill="#4c7cf5" radius={[6,6,0,0]} maxBarSize={42}/></BarChart></ResponsiveContainer>:<div className="empty-state">No student performance data</div>}</div></Card>
   <Card title="Department-wise Performance" subtitle="Average GPA by department"><div className="chart-box">{dept.length?<ResponsiveContainer><BarChart layout="vertical" data={dept} margin={{left:4,right:18}}><CartesianGrid stroke="#edf1f6" strokeDasharray="3 3" horizontal={false}/><XAxis type="number" domain={[0,10]} tick={{fontSize:9,fill:"#708099"}} axisLine={false} tickLine={false}/><YAxis type="category" dataKey="name" width={100} tick={{fontSize:9,fill:"#52627a"}} axisLine={false} tickLine={false}/><Tooltip/><Bar dataKey="gpa" fill="#7d67ef" radius={[0,6,6,0]} maxBarSize={20}/></BarChart></ResponsiveContainer>:<div className="empty-state">No department data</div>}</div></Card>
   <Card title="At-Risk Students" subtitle="Students requiring attention"><div className="risk-list">{risk.length?risk.slice(0,5).map((x,i)=><div className="risk-row" key={x.studentId||i}><div className="risk-avatar">S</div><div className="risk-main"><strong>{x.studentId}</strong><span>{x.department}</span></div><div className="risk-value"><span className="risk-tag">Needs attention</span>{x.gpa}</div></div>):<div className="empty-state">No students at risk</div>}</div></Card>
  </div>
  <div className="grid-2" style={{marginTop:11}}>
   <Card title="Recent Students Overview" subtitle="Latest student performance"><div style={{overflowX:"auto"}}><table className="mini-table"><thead><tr><th>Student ID</th><th>Department</th><th>GPA</th><th>Attendance</th><th>Quiz</th><th>Status</th></tr></thead><tbody>{students.slice(0,6).map(x=><tr key={x.studentId}><td><strong>{x.studentId}</strong></td><td>{x.department}</td><td>{x.gpa}</td><td>{x.attendancePercentage}%</td><td>{x.quizAverage}%</td><td><StatusPill tone={x.status==="Good"?"good":"warning"}>{x.status||"Needs Attention"}</StatusPill></td></tr>)}</tbody></table></div></Card>
   <Card title="Quick Actions" subtitle="Common administration tasks"><div className="quick-grid"><div className="quick"><div className="quick-icon"><Users size={17}/></div><div><strong>Manage Students</strong><span>View and manage student information</span></div></div><div className="quick green"><div className="quick-icon"><CalendarCheck size={17}/></div><div><strong>Attendance</strong><span>Monitor attendance records</span></div></div><div className="quick purple"><div className="quick-icon"><BookOpen size={17}/></div><div><strong>Courses</strong><span>{courses.length} courses available</span></div></div><div className="quick orange"><div className="quick-icon"><FileCheck2 size={17}/></div><div><strong>Analytics</strong><span>Review institution performance</span></div></div></div></Card>
  </div>
  <div style={{marginTop:11}}><Card title="Recent Activity" subtitle="Latest platform activity"><table className="mini-table"><thead><tr><th>Activity</th><th>Details</th><th>Status</th></tr></thead><tbody><tr><td>Student management</td><td>{s.totalStudents||0} student(s) registered</td><td><StatusPill tone="good">Updated</StatusPill></td></tr><tr><td>Course management</td><td>{courses.length} course(s) available</td><td><StatusPill tone="blue">Active</StatusPill></td></tr><tr><td>Risk monitoring</td><td>{s.atRiskStudents||0} student(s) require attention</td><td><StatusPill tone="danger">Attention</StatusPill></td></tr></tbody></table></Card></div>
 </Layout>
}
