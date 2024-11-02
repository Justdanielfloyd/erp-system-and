"use client";
import React from "react";
import { Loader } from "@/app/assets";

export default function Loading() {
	return (
		<div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-50">
			<Loader className="w-12 h-12 text-gray-200 animate-spin dark:text-gray-600 fill-primary" />
		</div>
	);
}
