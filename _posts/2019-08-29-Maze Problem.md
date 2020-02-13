---
title: Maze Problem
tags:
  - 人工智能
---

## Task

- Please solve the maze problem (i.e., find the shortest path from the start point to the finish point) by using BFS or DFS (Python or C++)
- The maze layout can be modeled as an array, and you can use the data file `MazeData.txt` if necessary.

### MazeData.txt

```bash
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                 S%
% %%%%%%%%%%%%%%%%%%%%%%% %%%%%%%% %
% %%   %   %      %%%%%%%   %%     %
% %% % % % % %%%% %%%%%%%%% %% %%%%%
% %% % % % %             %% %%     %
% %% % % % % % %%%%  %%%    %%%%%% %
% %  % % %   %    %% %%%%%%%%      %
% %% % % %%%%%%%% %%        %% %%%%%
% %% %   %%       %%%%%%%%% %%     %
%    %%%%%% %%%%%%%      %% %%%%%% %
%%%%%%      %       %%%% %% %      %
%      %%%%%% %%%%% %    %% %% %%%%%
% %%%%%%      %       %%%%% %%     %
%        %%%%%% %%%%%%%%%%% %%  %% %
%%%%%%%%%%                  %%%%%% %
%E         %%%%%%%%%%%%%%%%        %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
```

## Codes

```cpp
#include <bits/stdc++.h>
using namespace std;
int main()
{
	ifstream fin("MazeData.txt");
	typedef pair<int, int> Coord;
	const int NPOS = -1;
#define X first
#define Y second
	vector<string> map;
	vector<vector<Coord>> pre;
	Coord st, ed;
	for (string s; getline(fin, s) && !s.empty();)
	{
		map.push_back(s);
		pre.push_back(vector<Coord>(s.size(), {NPOS, NPOS}));
		for (int i = map.size() - 1, j = 0; j < map[i].size(); ++j)
		{
			if (map[i][j] == 'S')
				st = {i, j};
			if (map[i][j] == 'E')
				ed = {i, j};
		}
	}
	for (deque<Coord> q(1, st); !q.empty() && pre[ed.X][ed.Y].X == NPOS; q.pop_front())
		for (Coord nex : vector<Coord>{
				 {q.front().X + 1, q.front().Y},
				 {q.front().X - 1, q.front().Y},
				 {q.front().X, q.front().Y + 1},
				 {q.front().X, q.front().Y - 1},
			 })
			if (0 <= nex.X && nex.X < map.size())
				if (0 <= nex.Y && nex.Y < map[nex.X].size())
					if (map[nex.X][nex.Y] == ' ' || map[nex.X][nex.Y] == 'E')
						if (pre[nex.X][nex.Y].X == NPOS)
						{
							q.push_back(nex);
							pre[nex.X][nex.Y] = q.front();
						}
	if (pre[ed.X][ed.Y].X == NPOS)
		return cout << "No Solution.", 0;
	for (ed = pre[ed.X][ed.Y]; pre[ed.X][ed.Y].X != NPOS; ed = pre[ed.X][ed.Y])
		map[ed.X][ed.Y] = 'X';
	for (const auto &s : map)
		cout << s << '\n';
}
```

## Results

```bash
g++ maze.cpp -o maze.out
```

```bash
$ ./maze.out
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                        XXXXXXXXXS%
% %%%%%%%%%%%%%%%%%%%%%%%X%%%%%%%% %
% %%   %   %      %%%%%%%XXX%%     %
% %% % % % % %%%% %%%%%%%%%X%% %%%%%
% %% % % % %        XXXXX%%X%%     %
% %% % % % % % %%%% X%%%XXXX%%%%%% %
% %  % % %   %    %%X%%%%%%%%      %
% %% % % %%%%%%%% %%XXXXXXXX%% %%%%%
% %% %   %%       %%%%%%%%%X%%     %
%    %%%%%% %%%%%%%      %%X%%%%%% %
%%%%%%      %       %%%% %%X%      %
%      %%%%%% %%%%% %    %%X%% %%%%%
% %%%%%%      %       %%%%%X%%     %
%        %%%%%% %%%%%%%%%%%X%%  %% %
%%%%%%%%%%XXXXXXXXXXXXXXXXXX%%%%%% %
%EXXXXXXXXX%%%%%%%%%%%%%%%%        %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
```
