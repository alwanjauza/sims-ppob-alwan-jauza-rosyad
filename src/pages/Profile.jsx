import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdOutlineEmail, MdPerson, MdEdit } from "react-icons/md";
import {
  getProfile,
  updateProfile,
  updateProfileImage,
  clearUserError,
} from "../redux/slices/userSlice";
import { logout } from "../redux/slices/authSlice";
import { clearHistory } from "../redux/slices/transactionSlice";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import ModalStatus from "../components/ui/ModalStatus";
import defaultProfile from "../assets/Profile Photo.png";

const profileSchema = z.object({
  email: z.string(),
  first_name: z.string().min(1, "Nama depan wajib diisi"),
  last_name: z.string().min(1, "Nama belakang wajib diisi"),
});

function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const { profile, loading, error } = useSelector((state) => state.user);

  const [modal, setModal] = useState({
    isOpen: false,
    status: "success",
    message: "",
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setValue("email", profile.email);
      setValue("first_name", profile.first_name);
      setValue("last_name", profile.last_name);
    }
  }, [profile, setValue]);

  const onSave = async (data) => {
    const result = await dispatch(
      updateProfile({
        first_name: data.first_name,
        last_name: data.last_name,
      })
    );

    if (updateProfile.fulfilled.match(result)) {
      setIsEditing(false);
      dispatch(clearUserError());

      setModal({
        isOpen: true,
        status: "success",
        message: "Update Pofile berhasil",
      });
    } else {
      setModal({
        isOpen: true,
        status: "failed",
        message: result.payload || "Gagal update profile",
      });
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 100 * 1024) {
        setModal({
          isOpen: true,
          status: "failed",
          message: "Ukuran file maksimal 100KB",
        });
        return;
      }

      const result = await dispatch(updateProfileImage(file));

      if (updateProfileImage.fulfilled.match(result)) {
        setModal({
          isOpen: true,
          status: "success",
          message: "Update Profile Image berhasil",
        });
      } else {
        setModal({
          isOpen: true,
          status: "failed",
          message: result.payload || "Gagal upload image",
        });
      }
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearHistory());
    navigate("/");
  };

  return (
    <div className='flex flex-col items-center justify-center w-full max-w-2xl mx-auto py-8'>
      <div className='relative mb-6'>
        <div className='w-32 h-32 rounded-full border border-gray-200 overflow-hidden'>
          <img
            src={
              profile?.profile_image &&
              profile?.profile_image !== "https://null"
                ? profile.profile_image
                : defaultProfile
            }
            alt='Profile'
            className='w-full h-full object-cover'
            onError={(e) => {
              e.target.src = defaultProfile;
            }}
          />
        </div>

        <button
          onClick={() => fileInputRef.current.click()}
          className='absolute bottom-0 right-0 bg-white border border-gray-300 rounded-full p-2 shadow-sm hover:bg-gray-50 transition'
        >
          <MdEdit size={16} className='text-black' />
        </button>

        <input
          type='file'
          ref={fileInputRef}
          className='hidden'
          accept='image/png, image/jpeg'
          onChange={handleImageUpload}
        />
      </div>

      <h2 className='text-3xl font-bold text-gray-900 mb-8 capitalize'>
        {profile?.first_name} {profile?.last_name}
      </h2>

      <div className='w-full space-y-2'>
        {error && (
          <Alert
            type='error'
            message={error}
            onClose={() => dispatch(clearUserError())}
          />
        )}

        <label className='text-sm font-medium text-gray-700 block mb-1'>
          Email
        </label>
        <Input
          {...register("email")}
          type='email'
          icon={MdOutlineEmail}
          disabled={true}
          className='bg-gray-50 cursor-not-allowed'
        />

        <label className='text-sm font-medium text-gray-700 block mb-1'>
          Nama Depan
        </label>
        <Input
          {...register("first_name")}
          type='text'
          icon={MdPerson}
          disabled={!isEditing}
          error={errors.first_name?.message}
        />

        <label className='text-sm font-medium text-gray-700 block mb-1'>
          Nama Belakang
        </label>
        <Input
          {...register("last_name")}
          type='text'
          icon={MdPerson}
          disabled={!isEditing}
          error={errors.last_name?.message}
        />
      </div>

      <div className='w-full mt-8 space-y-4'>
        {isEditing ? (
          <Button onClick={handleSubmit(onSave)} isLoading={loading}>
            Simpan
          </Button>
        ) : (
          <>
            <Button onClick={() => setIsEditing(true)}>Edit Profil</Button>

            <Button
              onClick={handleLogout}
              className='bg-white border border-red-500 text-red-500 hover:bg-red-50 focus:ring-red-200'
            >
              Logout
            </Button>
          </>
        )}
      </div>

      <ModalStatus
        isOpen={modal.isOpen}
        status={modal.status}
        message={modal.message}
        buttonText='Tutup'
        onClose={() => setModal({ ...modal, isOpen: false })}
      />
    </div>
  );
}

export default ProfilePage;
