import {OtherInforSchool} from './other-infor-school';


export interface TenantModel {
  name?: string;
  maTruong?: string;
  tenVietTat?:string;
  tenHieuTruong?: string;
  sdtHieuTruong?: string;
  ngayThanhLap?: string;
  diaChi?: string;
  dienThoai?: string;
  fax?: string;
  web?:string;
  email?: string;
  maSoThue?: string;
  khoaHoc?: string;
  coQuanChuQuan?: string;
  maDonViQuanLy?: string;
  tenDonViQuanLy?: string;
  maLoaiTruong?:string;
  maLoaiHinhDaoTao?: string;
  maKhuVuc?: string;
  maTinh?: string;
  maHuyen?: string;
  maXa?: string;
  mucChuan?: string;
  maVungKhoKhan?:string;
  trangThai?: string;
  extgitraProperties?: OtherInforSchool;
  id?: string;

  mucChuanQuocGiaId?: string;
  schoolLevelIds?: Array<string>;
  maDinhdanh?: string;
  maLoaiHinhDaoTaoChiTiet?: string;

}
