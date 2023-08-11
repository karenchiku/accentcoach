/****** Object:  Table [dbo].[accentcoach_bookings]    Script Date: 2023/8/2 下午 09:13:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[accentcoach_bookings](
	[orderid] [varchar](64) NULL,
	[username] [nvarchar](24) NULL,
	[phone] [varchar](30) NULL,
	[email] [varchar](64) NULL,
	[itemname] [nvarchar](64) NULL,
	[amount] [int] NULL,
	[bookingdate] [datetime] NULL,
	[created_datetime] [datetime] NULL,
	[previous_orderid] [int] NULL,
	[payment_completed_datetime] [datetime] NULL,
	[bookstatus] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[accentcoach_epaycallback]    Script Date: 2023/8/2 下午 09:13:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[accentcoach_epaycallback](
	[MerchantTradeNo] [varchar](64) NULL,
	[RtnCode] [int] NULL,
	[RtnMsg] [varchar](200) NULL,
	[TradeAmt] [int] NULL,
	[TradeNo] [varchar](64) NULL,
	[PaymentDate] [datetime] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[accentcoach_newsletter]    Script Date: 2023/8/2 下午 09:13:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[accentcoach_newsletter](
	[email] [varchar](64) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[accentcoach_timesheet]    Script Date: 2023/8/2 下午 09:13:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[accentcoach_timesheet](
	[teacherid] [int] NULL,
	[opendatetime] [datetime] NULL,
	[status] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[accentcoach_users]    Script Date: 2023/8/2 下午 09:13:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[accentcoach_users](
	[userid] [int] NULL,
	[username] [nvarchar](24) NULL,
	[password] [nvarchar](64) NOT NULL,
	[phone] [varchar](30) NULL,
	[email] [varchar](64) NULL,
	[created_datetime] [datetime] NULL,
	[status] [char](1) NULL,
	[email_verified] [char](1) NULL,
	[phone_verified] [char](1) NULL
) ON [PRIMARY]
GO
