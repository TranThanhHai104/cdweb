<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
    <title>Danh sách thành viên</title>
    <style>
        table { width: 90%; border-collapse: collapse; }
        th { background-color: #00FFCC; padding: 10px; border: 1px solid #ccc; }
        td { padding: 8px; border: 1px solid #ccc; }
    </style>
</head>
<body>
<h2>DANH SÁCH THÀNH VIÊN</h2>
<p>Tổng số thành viên: <b>${userList.size()}</b>
    <button style="float:right" onclick="location.href='register.jsp'">Thêm nhân viên...</button>
</p>

Chọn giới tính:
<select id="genderFilter" onchange="filterData()">
    <option value="all">Chọn ...</option>
    <option value="Nam">Nam</option>
    <option value="Nữ">Nữ</option>
</select>

<table>
    <thead>
    <tr>
        <th>Họ tên</th>
        <th>Ngày sinh</th>
        <th>Giới tính</th>
        <th>Email</th>
    </tr>
    </thead>
    <tbody id="resultBody">
    <c:forEach var="entry" items="${userList}">
        <tr>
            <td>${entry.value.hoten}</td>
            <td>${entry.value.ngaysinh}</td>
            <td>${entry.value.gioitinh}</td>
            <td><a href="detail.jsp?email=${entry.value.email}">${entry.value.email}</a></td>
        </tr>
    </c:forEach>
    </tbody>
</table>

<script>
    function filterData() {
        let gender = document.getElementById("genderFilter").value;
        fetch("validate?action=filter&gender=" + gender)
            .then(res => res.text())
            .then(data => document.getElementById("resultBody").innerHTML = data);
    }
</script>
</body>
</html>