"use client";
import type { ConfirmModalProps } from "@/types/Modal/ConfirmModal";
import React from "react";
import Image from "next/image";

// icon
import ExclamationIcon from "@/images/Exclamation.svg";

const ConfirmModal: React.FC<ConfirmModalProps> = ({
	isOpen,
	title,
	description,
	confirmLabel = "確認",
	cancelLabel = "取消",
	onConfirm,
	onCancel,
}) => {
	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
			onClick={onCancel}
		>
			<div
				className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg text-center"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="mb-4 flex flex-col items-center">
					<Image
						src={ExclamationIcon}
						alt="login"
						width={100}
						height={100}
						className="w-9 h-9 mb-2"
					/>
					<span className="text-base font-medium leading-6 text-[#505050] my-5">
						{title}
					</span>
					{description && (
						<p className="text-sm leading-[22px] font-normal text-[#7C7C7C]">
							{description.split("\n").map((line, index) => (
								<React.Fragment key={index}>
									{line}
									<br />
								</React.Fragment>
							))}
						</p>
					)}
				</div>
				<div className="flex flex-col justify-center gap-4 mt-6">
					<button
						type="button"
						className="bg-[#D82027] hover:bg-red-700 text-white rounded-sm px-3 py-[5px] text-sm font-medium leading-6"
						onClick={onConfirm}
					>
						{confirmLabel}
					</button>
					<button
						type="button"
						className="border-[1px] border-[#D3D3D3] bg-white hover:bg-gray-100 text-[#7C7C7C] rounded-sm px-3 py-[5px] text-sm font-medium leading-6"
						onClick={onCancel}
					>
						{cancelLabel}
					</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmModal;
